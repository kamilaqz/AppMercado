import React from 'react';
import { StatusBar } from 'expo-status-bar';

import {NavigationContainer} from '@react-navigation/native'
import Routes from './src/routes';

export default function App() {
  return (
   <NavigationContainer>
    <StatusBar backgroundColor="#38A69D" barStyle="ligth-content" />
   <Routes/>
   </NavigationContainer>
  );
}

