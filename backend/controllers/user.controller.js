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

        
        const { fullName, email, password } = req.body;

        // Check if user misses any fields
        if (!fullName || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        // Check if the user already exists
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return next(new AppError("Email already exists, please login", 400));
        }

        // Save user in the database and log the user in
        const user = await userModel.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: "",
            },
        });

        const verificationToken = await user.generateEmailVerificationToken();
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        const subject = 'Email Verification';
        const message = `Please verify your email by clicking on this link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`;
        
        await sendEmail(email, subject, message);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email to verify your account.",
            user
        });

        if (!user) {
            return next(new AppError("User registration failed, please try again", 400));
        }

        

        

        // File upload
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "Learning-Management-System",
                    width: 250,
                    height: 250,
                    gravity: "faces",
                    crop: "fill",
                });

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // Remove the file from the server
                    fs.rmSync(`uploads/${req.file.filename}`);
                }
            } 
            
            catch (e) {
                return next(new AppError(e.message || "File not uploaded, please try again", 500));
            }
        }

        await user.save();

        user.password = undefined;

        const token = await user.generateJWTToken();

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } 
    
    catch (e) {
        return next(new AppError(e.message, 500));
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
        const users = await userModel.find().select('-password');

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
        const { fullName, role, subscription } = req.body;
        const { userId } = req.params;

        if (!userId) {
            return next(new AppError("User ID is required", 400));
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new AppError("User does not exist", 400));
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (role) {
            user.role = role;
        }

        if (subscription) {
            user.subscription.status = subscription;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User details updated successfully",
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


// Create blog post
const createBlog = async (req, res, next) => {
    try {
        const { title, excerpt, content } = req.body;

        if (!title || !excerpt || !content) {
            return next(new AppError("All fields are required", 400));
        }

        let imageUrl = "";
        let publicId = "";

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "Learning-Management-System-Blogs",
                    width: 1000,
                    height: 600,
                    crop: "fill"
                });

                if (result) {
                    imageUrl = result.secure_url;
                    publicId = result.public_id;
                    fs.rmSync(`uploads/${req.file.filename}`);
                }
            } catch (e) {
                return next(new AppError(e.message || 'Image upload failed', 500));
            }
        }

        const blog = await blogModel.create({
            title,
            excerpt,
            content,
            image: {
                public_id: publicId,
                secure_url: imageUrl
            },
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        });

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// Delete blog post
const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const blog = await blogModel.findById(id);

        if (!blog) {
            return next(new AppError("Blog not found", 404));
        }

        // Delete image from cloudinary if exists
        if (blog.image.public_id) {
            await cloudinary.v2.uploader.destroy(blog.image.public_id);
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// Get all blogs
const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await blogModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            blogs
        });

    } catch (e) {
        return next(new AppError(e.message, 500));
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
    
}