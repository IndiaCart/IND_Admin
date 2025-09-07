import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import { ThemeContext } from './src/design/ThemeContext';
import { useSelector } from 'react-redux';

const App = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme.mode === 'dark';
  const {userData ,isAuthenticated , loading} = useSelector((state)=> state.user);
useEffect(()=>{
    console.log("userData =>", userData)
    console.log("loading =>", loading)
    console.log("isAuthenticated =>", isAuthenticated)
},[userData ,loading , isAuthenticated])

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigation />
    </>
  );
};


export default App;
