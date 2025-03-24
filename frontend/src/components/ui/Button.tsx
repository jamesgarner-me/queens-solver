import React from 'react';
import './Button.css';

interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    disabled = false,
    children,
    variant = 'primary',
    className = '',
}) => {
    return (
        <button className={`button ${variant} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
