import Firebase from 'firebase';


const config = {
apiKey: YOUR_FIREBASE_APIKEY,
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