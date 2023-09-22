import React from "react";

import { useRouteError } from "react-router-dom";

export function ErrorNotFoundPage() {
  const error = useRouteError();

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