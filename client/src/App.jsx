import React from 'react';
import { UserProvider } from "./context/index";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Navbar from './components/Nav';
import Dashboard from './pages/dashboard';
import Register from './pages/register';
import AddEmployee from './pages/addemployee';
import EmployeeList from './pages/employeelist';
import Edit from './pages/edit';

function App() {
  return (
    <UserProvider>
      <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add_employee" element={<AddEmployee />} />
        <Route path="/list_employee" element={<EmployeeList />} />
        <Route path="/edit/:f_Email" element={<Edit />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
