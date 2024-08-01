import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Dashboard from "./pages/dashboard/Dashboard";
import Sidebar from './components/sidebar/Sidebar';
import Layout from './components/layout/Layout';
import Uploadimage from "./pages/upload/Uploadimage";
import "react-toastify/dist/ReactToastify.css";

// import axios from "axios";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch } from "react-redux";
// import { getLoginStatus } from "./services/authService";
// import { SET_LOGIN } from "./redux/features/auth/authSlice";
// import AddProduct from "./pages/addProduct/AddProduct";
// import ProductDetail from "./components/product/productDetail/ProductDetail";
// import EditProduct from "./pages/editProduct/EditProduct";
// import Profile from "./pages/profile/Profile";
// import EditProfile from "./pages/profile/EditProfile";
// import Contact from "./pages/contact/Contact";

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/forgot" element={<Forgot/>}/>
      <Route path="/upload" element={<Uploadimage/>} />
      <Route path="/resetpassword/:resetToken" element={<Reset/>}/>
      <Route path="/dashboard" element={
        <Sidebar>
          <Layout>
            <Dashboard/>
          </Layout>
        </Sidebar>
      }/>
    </Routes>
  </Router>
  );
}

export default App;
