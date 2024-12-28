import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../Redux/Slices/AuthSlice';

const EmailVerification = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                await dispatch(verifyEmail(token)).unwrap();
                setVerificationStatus('success');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setVerificationStatus('error');
            }
        };

        if (token) {
            verifyUserEmail();
        }
    }, [token, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                {verificationStatus === 'verifying' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Verifying Email</h2>
                        <p>Please wait while we verify your email address...</p>
                    </div>
                )}

                {verificationStatus === 'success' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h2>
                        <p>Your email has been successfully verified. Redirecting to login...</p>
                    </div>
                )}

                {verificationStatus === 'error' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
                        <p>The verification link is invalid or has expired.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;