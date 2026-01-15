import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router";
import useAuth from "../../hook/useAuth";

const ForgotPassword = () => {
    const { resetPassword, setLoading } = useAuth();
    const [email, setEmail] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (!email) {
            return toast.error("Please enter your email address");
        }

        try {
            await resetPassword(email);
            toast.success("Password reset email sent! Check your inbox.");
            setEmail("");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-6 pt-20">
            <div className="max-w-md w-full bg-base-200 p-8 rounded-[2rem] shadow-2xl border border-base-300 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mx-auto mb-4">
                            <FaLockOpen />
                        </div>
                        <h2 className="text-3xl font-black text-base-content">Forgot Password?</h2>
                        <p className="text-base-content/60 mt-2">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase tracking-wider opacity-60">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="input input-bordered w-full pl-12 rounded-xl h-14 focus:ring-2 focus:ring-primary/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full h-14 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
                        >
                            Send Reset Link
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-base-300">
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal icon for LockOpen
const FaLockOpen = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M400 256H152V152.9c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v16c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-16C376 68 307.5 0 223.5 0 139.5 0 71 69.5 71 153.5V256h-23c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
    </svg>
);

export default ForgotPassword;
