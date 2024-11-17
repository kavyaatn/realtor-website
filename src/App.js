import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Header from './componets/Header';

function App() {
  return (
    <>
    <Router>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />        
      </Routes>
    </Router>
    </>
  );
}

export default App;
