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
import NavigationBar from './components/Navbar';
import PrivateRoutes from './routes/PrivateRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import ConfirmRegisterForm from './pages/ConfirmRegister';
import ConfirmRegisterRoute from './routes/ConfirmRegisterRoute';

const App = () => {

  return (
    <>
      <BrowserRouter>
        <NavigationBar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />

          
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />

          <Route element={<ConfirmRegisterRoute/>}>
          <Route path="/confirmRegister" element={<ConfirmRegisterForm />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route element={<PrivateRoutes allowedGroups={['Admin']} />}>
              <Route path="/adminboard" element={<AdminPage />} />
            </Route>

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