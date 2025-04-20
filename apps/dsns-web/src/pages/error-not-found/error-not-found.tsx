import { useRouteError } from 'react-router-dom';
import './error-not-found.css'; // Add a CSS file for styling

export function ErrorNotFoundPage() {
    const error = useRouteError() as { message: string; statusText: string };

    return (
        <div id="error-not-found-page" className="error-page">
            <div className="error-container">
                <h1 className="error-title">404</h1>
                <h2 className="error-subtitle">Page Not Found</h2>
                <p className="error-message">Sorry, an unexpected error has occurred.</p>
                <p className="error-details">
                    <i>{error?.statusText || error?.message}</i>
                </p>
                <a href="/" className="error-link">
                    Go Back to Home
                </a>
            </div>
        </div>
    );
}
