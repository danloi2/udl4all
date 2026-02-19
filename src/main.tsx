// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/base.css';
import './css/print.css';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </HashRouter>
  </React.StrictMode>
);
