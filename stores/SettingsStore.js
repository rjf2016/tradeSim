import Firebase from 'firebase';
import { API_KEY } from '@env'

const config = {
apiKey: API_KEY,
authDomain: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
databaseURL: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
projectId: "XXXXXX-XXXXX",
storageBucket: "",
messagingSenderId: "432966879226",
appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
};

// const unitId = 'ca-app-pub-8142056705160793/7905699587';   //AdMob unit ID

class SettingsStore { 
  constructor() {
    Firebase.initializeApp(config)   
  }
}
export default new SettingsStore()