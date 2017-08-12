import React from 'react'; // eslint-disable-line
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import configureStore from './store/configureStore'
import { registerScreens } from './register'

const store = configureStore()

registerScreens(store, Provider);


Navigation.startSingleScreenApp({
  screen: {
    screen: 'groceries.home', // unique ID registered with Navigation.registerScreen
    title: 'Home', // title of the screen as appears in the nav bar (optional)
    navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
    navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
  }
})