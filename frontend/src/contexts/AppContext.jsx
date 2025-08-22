import React, { createContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [appReady, setAppReady] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Handle sidebar toggle
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Set app as ready after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Notification handling
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      ...notification,
      duration: notification.duration || 5000,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  }, [removeNotification]);
  
  // Close sidebar when navigating on mobile
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);
  
  return (
    <AppContext.Provider 
      value={{
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        isOnline,
        appReady,
        notifications,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;