import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Moved global declaration for ion-icon custom element here from App.tsx.
// Placing it in the application's entry point ensures it is loaded first and
// correctly augments the JSX namespace, preventing it from overriding
// standard HTML elements like 'div', 'p', etc.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
      };
      // FIX: Added an index signature to allow all standard HTML elements.
      // The previous declaration was overwriting React's intrinsic elements,
      // causing widespread type errors for tags like 'div', 'p', etc.
      // This signature tells TypeScript to allow any other string-keyed elements.
      [elemName: string]: any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);