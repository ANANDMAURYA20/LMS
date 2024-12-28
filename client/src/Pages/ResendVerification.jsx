import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resendVerificationEmail } from '../Redux/Slices/AuthSlice';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const handleResend = async (e) => {
        e.preventDefault();
        if (email) {
            await dispatch(resendVerificationEmail(email));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Resend Verification Email</h2>
                <form onSubmit={handleResend}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Resend Verification Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResendVerification;