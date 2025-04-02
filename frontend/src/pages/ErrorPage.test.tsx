import { render, screen } from '@testing-library/react';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
    test('renders 404 error page correctly', () => {
        render(<ErrorPage errorCode={404} />);

        // Check that the error code is displayed
        expect(screen.getByText('404')).toBeInTheDocument();

        // Check that the default title is displayed
        expect(screen.getByText('Page Not Found')).toBeInTheDocument();

        // Check that the actual message is displayed
        const message = screen.getByRole('paragraph');

        // This is what's actually in the component for 404 errors:
        expect(message.textContent).toContain('The page you requested could not be found');

        // Check that the "Return to Queens Solver" button is present
        expect(screen.getByText('Return to Queens Solver')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/queens-solver');
    });

    test('renders 403 error page correctly', () => {
        render(<ErrorPage errorCode={403} />);

        // Check that the error code is displayed
        expect(screen.getByText('403')).toBeInTheDocument();

        // Check that the default title is displayed
        expect(screen.getByText('Access Denied')).toBeInTheDocument();

        // Check that the actual message is displayed
        const message = screen.getByRole('paragraph');

        // This is what's actually in the component for 403 errors:
        expect(message.textContent).toContain('Sorry, you do not have permission to access this page');

        // Check that the "Return to Queens Solver" button is present
        expect(screen.getByText('Return to Queens Solver')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/queens-solver');
    });

    test('renders 500 error page correctly', () => {
        render(<ErrorPage errorCode={500} />);

        // Check that the error code is displayed
        expect(screen.getByText('500')).toBeInTheDocument();

        // Check that the default title is displayed
        expect(screen.getByText('An Error Occurred')).toBeInTheDocument();

        // Check that the actual message is displayed
        const message = screen.getByRole('paragraph');

        // This is what's actually in the component for 500 errors:
        expect(message.textContent).toContain('Something went wrong. Please try again later.');

        // Check that the "Return to Queens Solver" button is present
        expect(screen.getByText('Return to Queens Solver')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/queens-solver');
    });

    test('renders 5-- error page correctly', () => {
        render(<ErrorPage errorCode={502} />);

        // Check that the error code is displayed
        expect(screen.getByText('502')).toBeInTheDocument();

        // Check that the default title is displayed
        expect(screen.getByText('An Error Occurred')).toBeInTheDocument();

        // Check that the actual message is displayed
        const message = screen.getByRole('paragraph');

        // This is what's actually in the component for 500 errors:
        expect(message.textContent).toContain('Something went wrong. Please try again later.');

        // Check that the "Return to Queens Solver" button is present
        expect(screen.getByText('Return to Queens Solver')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/queens-solver');
    });

    test('allows custom title and message', () => {
        const customTitle = 'Custom Error Title';
        const customMessage = 'This is a custom error message for testing.';

        render(<ErrorPage errorCode={418} title={customTitle} message={customMessage} />);

        expect(screen.getByText('418')).toBeInTheDocument();
        expect(screen.getByText(customTitle)).toBeInTheDocument();
        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
});
