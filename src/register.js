import { Navigation } from 'react-native-navigation';

import Groceries from './components/Groceries';
import ItemView from './components/ItemView';

export function registerScreens(store, Provider) {
    Navigation.registerComponent('groceries.home', () => Groceries, store, Provider);
    Navigation.registerComponent('groceries.itemView', () => ItemView, store, Provider);
}