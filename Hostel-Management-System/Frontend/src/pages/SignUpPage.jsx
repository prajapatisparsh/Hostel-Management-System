import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            await AuthService.signup({ email, password });
            alert('Signup successful');
            navigate('/login');
        } catch (err) {
            setError('Error during signup');
        }
    };

    // Inline styles
    const pageStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f9',
    };

    const containerStyle = {
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    };

    const titleStyle = {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
        fontSize: '28px',
        fontWeight: '600',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        backgroundColor: '#fafafa',
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px',
    };

    const buttonHoverStyle = {
        ...buttonStyle,
        backgroundColor: '#45a049',
    };

    const errorStyle = {
        color: 'red',
        textAlign: 'center',
        marginTop: '10px',
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <h2 style={titleStyle}>Sign Up</h2>
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div style={errorStyle}>{error}</div>}
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default SignUpPage;
