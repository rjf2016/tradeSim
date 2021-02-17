import { Navigation } from 'react-native-navigation';

export default class App {
  constructor() {  
 
    Navigation.events().registerAppLaunchedListener(() => {
      Navigation.setRoot({
        root: {
          component: {
            id: 'MyInitializingId',
            name: 'Initializing'
          }
        },
      });
    });   
  } 
}
 