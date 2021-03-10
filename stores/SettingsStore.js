import Firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCXnDNtMyKx3aFyAloBUhoFNDsXHBxtGJQ",
  authDomain: "tradesim-6f6e0.firebaseapp.com",
  databaseURL: "https://tradesim-6f6e0.firebaseio.com",
  projectId: "tradesim-6f6e0",
  storageBucket: "",
  messagingSenderId: "432966879226",
  appId: "1:432966879226:web:640752ea92c38837"
};

export const twitterConfig = {
  TWITTER_CONSUMER_KEY: "pfgWlVBePZW2FfxZiAYwMM1FA",
  TWITTER_CONSUMER_SECRET: "iJdusDToP35YapuHnKK2QiVS8NxZQKurDBdg2y5vfORwss5f2i"
}

export const googleConfig = {
  WEBCLIENTID: "270723734218-h49r2oh7aejhai7ok6a6o5gp0g0c9te3.apps.googleusercontent.com",
  IOSCLIENTID: "270723734218-9qpt8k4ojicevo9c7fp2dt3bhd9q1c7q.apps.googleusercontent.com"
}
// const unitId = 'ca-app-pub-8142056705160793/7905699587';   //AdMob unit ID

class SettingsStore {
  constructor() {
    Firebase.initializeApp(config)
  }
}
export default new SettingsStore()