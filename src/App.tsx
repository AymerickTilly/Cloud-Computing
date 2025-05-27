import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { BrowserRouter, Route, Routes } from 'react-router';
import RegisterForm from './pages/Register';
import AdminPage from './pages/AdminPage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NavigationBar from './components/Navbar';
import PrivateRoutes from './routes/PrivateRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import ConfirmRegisterForm from './pages/ConfirmRegister';
import ConfirmRegisterRoute from './routes/ConfirmRegisterRoute';
import { useEffect } from 'react';
import { initAuth, useAuthStore } from './auth/AuthStore';
import AuthenticationRoutes from './routes/AuthenticationRoutes';
import LocationManager from './auth/LocationManager';
import AskResetCode from './pages/AskResetCode';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordRoute from './routes/ResetPasswordRoute';
import AddItemPage from './pages/AddItemPage';
import UpdateItemPage from './pages/UpdateItemPage';
import ListOrdersPage from './pages/ListOrdersPage';

const App = () => {

  const { user } = useAuthStore();

  useEffect(() => {
    initAuth();

  }, []);

  return (
    <>
      <BrowserRouter>
        <LocationManager/>
        {user && <NavigationBar />}
        <Routes>
            <Route element={<AuthenticationRoutes/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>
          
            <Route element={<ResetPasswordRoute/>}>
              <Route path="/askResetCode" element={<AskResetCode/>}/>
              <Route path="/resetPassword" element={<ResetPassword/>}/>
            </Route>
            <Route element={<ConfirmRegisterRoute/>}>
              <Route path="/confirmRegister" element={<ConfirmRegisterForm />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/listOrdersPage" element={<ListOrdersPage />} />
              <Route path="/Checkout" element={<Checkout />} />

            {/* // Admin Layout Route*/}
              <Route element={<PrivateRoutes allowedGroups={['Admin']} />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/add-item" element={<AddItemPage />} />
              {/* // Admin Layout Route */}
                <Route path="/admin/update-item" element={<UpdateItemPage />} />
                <Route path="/admin/orders" element={<ListOrdersPage />} />
              </Route>
            
              {/* // Admin Layout Route*/}
              <Route element={<PrivateRoutes allowedGroups={['Customer']} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
