import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import { CampaignProvider } from './context/CampaignContext';

const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <CampaignProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CampaignProvider>
    </Router>
  </React.StrictMode>,
);
