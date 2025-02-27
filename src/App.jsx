import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx'; 
import ForgotPassword from './pages/ForgotPassword.jsx';
import { AuthProvider } from './AuthContext.jsx';
import NominatimTest from './components/nominatimTest.jsx';  
import EventAdd from './pages/EventAdd.jsx';
import AdminPage from './pages/AdminPage.jsx';
import PendingEventsPage from './pages/PendingEventsPage.jsx';
import './App.css';
import UserListPage from './pages/UserListPage.jsx';
import EventListPage from './pages/EventListPage.jsx';
import ResetPasswordLink from './components/ResetPasswordLink.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProfileEditForm from './components/ProfileEditForm.jsx';
import SelectInterests from './pages/SelectInterests.jsx';
import CategoryPage from './pages/CategoryPage';
import Chat from './components/Chat';

function App() {
  return (
    <AuthProvider>
      <Router>
      
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/home" element={<Home />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/event-add" element={<EventAdd />} />
          <Route path="/register" element={<Register />} />  
          <Route path="/nominatim-test" element={<NominatimTest />} />  
          <Route path="/admin" element={<AdminPage />} /> 
          <Route path="/admin/pending-events" element={<PendingEventsPage />} /> 
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/events" element={<EventListPage />} />
          <Route path="/reset-password-link" element={<ResetPasswordLink />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile/edit" element={<ProfileEditForm />} />
          <Route path="/select-interests" element={<SelectInterests />} />
          <Route path="/admin/categories" element={<CategoryPage />} />
         </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
