import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import fs from 'fs';
import cloudinary from 'cloudinary';
import AppError from "../utils/error.utils.js";
import sendEmail from "../utils/sendEmail.js";

const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: true, 
    sameSite: 'none'
}


// Register  
const register = async (req, res, next) => {
    try {
        console.log('Registration request body:', req.body);
        const { fullName, email, password, number, role } = req.body;

        // Check if user misses any fields
        if (!fullName || !email || !password || !number) {
            return next(new AppError("All fields are required", 400));
        }

        // Check if the user already exists
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return next(new AppError("Email already exists, please login", 400));
        }

        // Process and validate role
        const processedRole = (role || 'STUDENT').toString().trim().toUpperCase();
        if (!['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(processedRole)) {
            return next(new AppError(`Invalid role: ${processedRole}. Must be one of: STUDENT, INSTRUCTOR, ADMIN`, 400));
        }

        // Create new user with validated data
        const user = await userModel.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            number: number.trim(),
            role: processedRole,
            avatar: {
                public_id: email,
                secure_url: "",
            },
        });

        const verificationToken = await user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        const subject = 'Email Verification';
        const message = `Please verify your email by clicking on this link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`;
        
        await sendEmail(email, subject, message);

        // Handle file upload if present
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "Learning-Management-System",
                    width: 250,
                    height: 250,
                    gravity: "faces",
                    crop: "fill"
                });

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;
                    await user.save();
                }

                fs.rmSync(`uploads/${req.file.filename}`);
            } catch (error) {
                console.error('File upload error:', error);
            }
        }

        // Remove password from response
        user.password = undefined;

        // Generate JWT token
        const token = await user.generateJWTToken();
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email to verify your account.",
            user
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            console.error('Validation error details:', error.errors);
        }
        return next(new AppError(error.message || "Registration failed", 500));
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Hash token
        const emailVerificationToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with token and valid expiry
        const user = await userModel.findOne({
            emailVerificationToken,
            emailVerificationExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Invalid or expired verification token', 400));
        }

        // Update user
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Resend verification email
const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (user.isEmailVerified) {
            return next(new AppError('Email already verified', 400));
        }

        const verificationToken = await user.generateEmailVerificationToken();
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

        const subject = 'Email Verification';
        const message = `Please verify your email by clicking on this link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`;
        
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: 'Verification email resent successfully'
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // check if user miss any field
        if (!email || !password) {
            return next(new AppError('All fields are required', 400))
        }
        
        const user = await userModel.findOne({ email }).select('+password');
        if (!user.isEmailVerified) {
            return next(new AppError('Please verify your email before logging in', 400));
        }

        if (!user || !(bcrypt.compareSync(password, user.password))) {
            return next(new AppError('Email or Password does not match', 400))
        }

        const token = await user.generateJWTToken();

        user.password = undefined;

        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            success: true,
            message: 'User loggedin successfully',
            user,
        })
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}


// logout
const logout = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            secure: true,
            maxAge: 0,
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: 'User loggedout successfully'
        })
    }
    catch (e) {
        return next(new AppError(e.message, 500))
    }
}


// getProfile
const getProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        })
    } catch (e) {
        return next(new AppError('Failed to fetch user profile', 500))
    }
}

// forgot password
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    // check if user does'nt pass email
    if (!email) {
        return next(new AppError('Email is required', 400))
    }

    const user = await userModel.findOne({ email });
    // check if user not registered with the email
    if (!user) {
        return next(new AppError('Email not registered', 400))
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.CLIENT_URL}/user/profile/reset-password/${resetToken}`

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking ${resetPasswordURL} Reset your password</$>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\n If you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email}`,
        });
    } catch (e) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();
        return next(new AppError(e.message, 500));
    }

}


// reset password
const resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;

        const { password } = req.body; 

        const forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await userModel.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return next(new AppError("Token is invalid or expired, please try again", 400));
        }

        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}

// change password
const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.user;

        if (!oldPassword || !newPassword) {
            return next(new AppError("All fields are requared", 400));
        }

        const user = await userModel.findById(id).select('+password');

        if (!user) {
            return next(new AppError("User does not exist", 400));
        }

        if (!(bcrypt.compareSync(oldPassword, user.password))) {
            return next(new AppError("Invalid Old Password", 400));
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (e) {
        return next(new AppError(e.message, 500))
    }

}

// get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().select('+password');
        // Exclude the password field from the response
        // users.forEach(user => user.password = bcrypt.compareSync(user.password, user.password));
        res.status(200).json({
            success: true,
            message: "All registered users",
            users
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// update user by admin
const updateUserByAdmin = async (req, res, next) => {
    try {
        const { fullName, role, subscription, number, isEmailVerified } = req.body;
        const { userId } = req.params;

        if (!userId) {
            return next(new AppError("User ID is required", 400));
        }

        // Using findByIdAndUpdate instead of find + save
        // This avoids triggering full model validation
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(fullName && { fullName }),
                    ...(role && { role }),
                    ...(number && { number }),
                    ...(isEmailVerified && { isEmailVerified }),
                    ...(subscription?.status && { 'subscription.status': subscription.status })
                }
            },
            { 
                new: true, // Return updated document
                runValidators: false // Don't run model validations
            }
        );

        if (!updatedUser) {
            return next(new AppError("User does not exist", 400));
        }

        res.status(200).json({
            success: true,
            message: "User details updated successfully",
            user: updatedUser
        });

    } catch (e) {
        console.error('Server error:', e);
        return next(new AppError(e.message, 500));
    }
}


const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id).select('-password');

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "User details",
            user
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}



// update profile
const updateUser = async (req, res, next) => {
    try {
        const { fullName } = req.body;
        const { id } = req.user;

        console.log(fullName);

        const user = await userModel.findById(id);

        if (!user) {
            return next(new AppError("user does not exist", 400));
        }

        if (fullName) {
            user.fullName = fullName
        }

        if (req.file) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);

            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'Learning-Management-System',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                })

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // Remove file from server
                    fs.rmSync(`uploads/${req.file.filename}`);

                }
            } catch (e) {
                return next(new AppError(e.message || 'File not uploaded, please try again', 500))
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User update successfully",
            user
        })
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}





export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser,
    getAllUsers,
    updateUserByAdmin,
    resendVerificationEmail,
    verifyEmail,
    getUserById,
    
}