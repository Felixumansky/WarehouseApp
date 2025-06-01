/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
console.log('THIS IS THE NEW LOG', Date.now());

AppRegistry.registerComponent(appName, () => App);
