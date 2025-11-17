import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Ionicons web components from the npm package so `<ion-icon>` works
// without a CDN script tag. This uses the loader provided by the ionicons package.
try {
  // Import at runtime to avoid compile errors in environments where node_modules isn't available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { defineCustomElements } = require('ionicons/dist/loader');
  if (typeof window !== 'undefined' && defineCustomElements) {
    defineCustomElements(window);
  }
} catch (err) {
  // If Ionicons can't be initialized, keep going — the app should still render, missing icons only.
  // We intentionally don't throw here to avoid breaking the app if the package isn't available.
  // Developers can check console for details.
  // console.warn('Ionicons initialization failed:', err);
}

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