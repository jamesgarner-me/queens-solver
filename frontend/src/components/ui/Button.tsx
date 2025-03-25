import React from 'react';
import './Button.css';

interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
    ariaLabel?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    disabled = false,
    children,
    variant = 'primary',
    className = '',
    ariaLabel,
    type = 'button',
}) => {
    return (
        <button
            className={`button ${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;
