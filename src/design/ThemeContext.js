import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from './theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? DarkTheme : LightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? DarkTheme : LightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
