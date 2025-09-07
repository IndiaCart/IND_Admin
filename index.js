/**
 * @format
 */
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Main from './Main';

const Root = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Main/>
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => Root);
