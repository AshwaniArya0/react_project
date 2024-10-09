import { useNavigate } from "react-router-dom"; 
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrent(window.location.pathname);
    }
  }, []);

  const logout = () => {
    setState(null);
    localStorage.removeItem("auth");
    console.log("Logout Successfull")
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-bold">
         
          <Link to="/">
            <img src="src/assets/logo_B2R.png" alt="logo" width="70" className="ml-2" />
          </Link>
        </div>

       
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          {state ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white">
                {state.user.f_userName}
              </Link>
              <Link to="/add_employee" className="text-gray-300 hover:text-white">
                Add Employee
              </Link>
              <Link to="/list_employee" className="text-gray-300 hover:text-white">
                Employee List
              </Link>
              <button onClick={logout} className="text-gray-300 hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
            </>
          )}
          
        </div>

       
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      
      {isOpen && (
        <div className="md:hidden">
          <Link to="/" className="block text-gray-300 hover:text-white px-4 py-2">
            Home
          </Link>
          <Link to="/about" className="block text-gray-300 hover:text-white px-4 py-2">
            About
          </Link>
          <Link to="/services" className="block text-gray-300 hover:text-white px-4 py-2">
            Services
          </Link>
          <Link to="/contact" className="block text-gray-300 hover:text-white px-4 py-2">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
