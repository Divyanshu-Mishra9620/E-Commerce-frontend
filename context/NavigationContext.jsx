"use client";
import { createContext, useContext, useState } from 'react';
import NavigationLoader from '@/components/NavigationLoader';

const NavigationContext = createContext({});

export function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = () => setIsNavigating(true);
  const endNavigation = () => setIsNavigating(false);

  return (
    <NavigationContext.Provider value={{ startNavigation, endNavigation }}>
      {isNavigating && <NavigationLoader />}
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);
