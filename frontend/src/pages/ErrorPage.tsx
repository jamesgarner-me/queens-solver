import React from 'react';
import './ErrorPage.css';

interface ErrorPageProps {
    errorCode: number;
    title?: string;
    message?: string;
}

/**
 * Custom error page component to handle various HTTP error codes
 */
const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode, title, message }) => {
    // Customize title based on error code if not provided
    const errorTitle =
        title || (errorCode === 403 ? 'Access Denied' : errorCode === 404 ? 'Page Not Found' : 'An Error Occurred');

    // Customize message based on error code if not provided
    const errorMessage =
        message ||
        (errorCode === 403
            ? 'Sorry, you do not have permission to access this page.'
            : errorCode === 404
              ? 'The page you requested could not be found.'
              : 'Something went wrong. Please try again later.');

    return (
        <main className="error-page-container">
            <div className="error-page-content">
                <div className="error-page-code" aria-hidden="true">
                    {errorCode}
                </div>
                <h1 className="error-page-title">{errorTitle}</h1>
                <p className="error-page-message">{errorMessage}</p>
                <div className="error-page-actions">
                    <a href="/queens-solver" className="error-page-button" aria-label="Go to homepage">
                        Return to Queens Solver
                    </a>
                </div>
            </div>
        </main>
    );
};

export default ErrorPage;
