import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // For direct access, we'll always set the user as authenticated
  const [user] = useState({
    id: 'default-user',
    username: 'Guest',
    email: 'guest@example.com',
    name: 'Guest User'
  });
  
  // Always authenticated for direct access
  const isAuthenticated = true;
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated,
        loading: false,
        authError: null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;