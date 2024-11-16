import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Singleuser from './pages/Singleuser.jsx';
import ProtectedRout from './components/ProtectedRout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'dashboard',
        element: <ProtectedRout component={<Dashboard />} />
      },
      {
        path: 'profile',
        element: <ProtectedRout component={<Profile />} />
      },
      {
        path: 'single-user/:id', 
        element: <ProtectedRout component={<Singleuser />} />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
   <RouterProvider router={router} />
);
