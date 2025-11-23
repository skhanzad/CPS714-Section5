import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import LandingPage from '../pages/LandingPage';
import ApplyPage from '../pages/ApplyPage';
import LoginPage from '../pages/LoginPage';
import PendingPage from '../pages/PendingPage';
import MyAccountPage from '../pages/MyAccountPage';
import StaffCheckoutPage from '../pages/StaffCheckoutPage';
import CatalogPage from '../pages/CatalogPage';
import LateFeeCalculatorPage from '../pages/LateFeeCalculatorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'apply', element: <ApplyPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'pending', element: <PendingPage /> },
      { path: 'account', element: <MyAccountPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'staff', element: <StaffCheckoutPage /> },
      { path: 'calculator', element: <LateFeeCalculatorPage /> }
    ]
  }
]);

export default router;
