import { useState, createContext, useEffect } from "react";

const userContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({ user: {}, token: "" });
  const [isClient, setIsClient] = useState(false); 

 
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true); 
      const storedState = localStorage.getItem("auth");
      if (storedState) {
        setState(JSON.parse(storedState)); 
      }
    }
  }, []);

  
  useEffect(() => {
    if (isClient) {
      if (state && state.token) {
        localStorage.setItem("auth", JSON.stringify(state));
      } else {
        localStorage.removeItem("auth");
      }
    }
  }, [state, isClient]);

  return (
    <userContext.Provider value={[state, setState]}>
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
