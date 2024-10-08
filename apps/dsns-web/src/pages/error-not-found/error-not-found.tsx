import { useRouteError } from 'react-router-dom';

export function ErrorNotFoundPage() {
    const error = useRouteError() as { message: string; statusText: string };

    return (
        <div id="error-not-found-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error?.statusText || error?.message}</i>
            </p>
        </div>
    );
}
