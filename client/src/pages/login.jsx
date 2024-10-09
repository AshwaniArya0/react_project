import React, { useState,useContext,useEffect } from "react"; 
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";  
import { userContext } from "../context/index"

const Login = () => {
  const [userName, setUserName] = useState(""); 
  const [pwd, setPwd] = useState(""); 
  const [error, setError] = useState("");
  const [state, setState] = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedState = localStorage.getItem("auth");
    if (savedState) {
      setState(JSON.parse(savedState)); 
      toast.error("You Have Already Logged In !!!");
      navigate("/"); 
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUserName(value);
    } else if (name === "password") {
      setPwd(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userName || !pwd) {
      setError("Both fields are required!");
      return;
    }
  
    setError(""); 
  
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/login", {
        userName: userName, 
        pwd: pwd,           
      });

      setState({
        user: data.user,
        token: data.token,
      });

      window.localStorage.setItem("auth", JSON.stringify(data));
  
      toast.success(data.message); 
      console.log("Login Successful:", data);
      navigate("/dashboard"); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter Username"
              value={userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter Password"
              value={pwd}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
            >
              Login
            </button>
          </div>
        </form>

        <label htmlFor="newregister" className="text-sm text-gray-700 mt-4 inline-block">
          New User?
          <Link to="/register" className="text-blue-500 hover:underline ml-1">
            Register
          </Link>
        </label>
      </div>
    </div>
  );
};

export default Login;
