import React, { useState } from 'react';
import { useGlobalContext } from '../context/context';

const AuthPage = () => {
    const { login, register, showAlert } = useGlobalContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [authError, setAuthError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        if (!email || !password) {
            setAuthError('Email and password are required.');
            return;
        }

        try {
            if (isLogin) {
                await login(email, password);
                showAlert(true, `Login successful!`);
            } else {
                if (password !== confirmPassword) {
                    setAuthError('Passwords do not match.');
                    return;
                }
                if (!name) {
                    setAuthError('Name is required.');
                    return;
                }

                await register(email, password, name);
                showAlert(true, 'Registration successful! You can now log in.');
                setIsLogin(true);
            }
        } catch (error) {
            console.error(error.message);
            
            if (isLogin) {
                if (error.code === "auth/invalid-credential") {
                    setAuthError("Wrong username or password.");
                } else {
                    setAuthError(error.message);
                }
            } else {
                if (error.code === "auth/email-already-in-use") {
                    setAuthError("This email is already registered.");
                } else if (error.code === "auth/invalid-email") {
                    setAuthError("Invalid email address.");
                } else if (error.code === "auth/weak-password") {
                    setAuthError("Password should be at least 6 characters.");
                } else {
                    setAuthError(error.message);
                }
            }
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setAuthError('');
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>{isLogin ? 'Log In' : 'Register'}</h2>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLogin && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <button type="submit" className="auth-btn">
                    {isLogin ? 'Log In' : 'Register'}
                </button>
                {authError && <p className="error-message">{authError}</p>}
                
                <p className="auth-switch">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={toggleAuthMode}>
                        {isLogin ? ' Register' : ' Log In'}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default AuthPage;
