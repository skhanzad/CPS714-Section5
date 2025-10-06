import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import LandingPage from '../pages/LandingPage';
import ApplyPage from '../pages/ApplyPage';
import LoginPage from '../pages/LoginPage';
import PendingPage from '../pages/PendingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'apply', element: <ApplyPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'pending', element: <PendingPage /> }
    ]
  }
]);

export default router;
