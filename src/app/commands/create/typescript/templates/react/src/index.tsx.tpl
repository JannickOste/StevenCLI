import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App"

const RootElement = document.getElementById('root');
if(!RootElement)
{
  throw new Error("Root template element not found")
}

ReactDOM.createRoot(RootElement)
        .render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
