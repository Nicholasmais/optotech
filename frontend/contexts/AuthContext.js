import React, { createContext, useContext, useState } from 'react';

// Crie um contexto
const AuthContext = createContext();

// Crie um provedor do contexto
export const AuthContextProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuth: false,
    user: {
      id: '',
      user: '',
      email: '',
      expirationDate: '',
    },
  });
  const [dpi, setDpi] = useState(96);

  return (
    <AuthContext.Provider value={{ authData, setAuthData, dpi, setDpi }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crie um gancho personalizado para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
