import Firebase from 'firebase';

const config = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  databaseURL: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

export const twitterConfig = {
  TWITTER_CONSUMER_KEY: "PLACEHOLDER",
  TWITTER_CONSUMER_SECRET: "PLACEHOLDER"
}

export const googleConfig = {
  WEBCLIENTID: "PLACEHOLDER.apps.googleusercontent.com",
  IOSCLIENTID: "PLACEHOLDER.apps.googleusercontent.com"
}

class SettingsStore {
  constructor() {
    Firebase.initializeApp(config)
  }
}
export default new SettingsStore()