import { observable, action, computed } from 'mobx';
import Firebase from 'firebase';
import { GoogleSignin } from 'react-native-google-signin';
import autobind from 'autobind-decorator'

@autobind
class AuthStore {
  @observable _userId = null;
  @observable _user = null;
  @observable _error = '';
  @observable loggedIn = false;
  @observable _useProduction = false;  //production Market Data flag

  uid = null;
  api_ref = null;  // holds the market data API key (prod or sandbox)
  api_url = null;  // holds the market data URL (prod or sandbox)
  api_isProduction = false;

  constructor() {
    Firebase.auth().onAuthStateChanged((user) => {  
      if (user != null) {
            this.user = user;  
            this.userId = user.uid;  
            uid = user.uid; //unique user id after firebase authentication      
            
            var apiRef = Firebase.database().ref().child('users/' + uid + '/iexData');
            apiRef.on('value', (snapshot) => {
              //Check Firebase to determine whether to use the production or sandbox API Key for Market Data 
              //Use Sandbox for debugging/testing to avoid overages
              if(snapshot.val().iexUseProduction == true){
                  this.api_ref = snapshot.val().iexProduction;
                  this.api_url = snapshot.val().iexProdURL;
                  this.api_isProduction = true;
              }
              else {
                this.api_ref = snapshot.val().iexSandbox;
                this.api_url = snapshot.val().iexDevURL;
                this.api_isProduction = false;
              }
        });
        }
    })
  }

  setProductionAPIStatus(useProd) {
    if (!this.user)
      return;   //not signed in

    var apiRef = Firebase.database().ref().child('users/' + this.user.uid + '/iexData')
    apiRef.update({ iexUseProduction: useProd });
    this.useProduction = useProd;
  }

  //Called to see if session is still valid.  If Firebase.auth().signInWithCredential(credential) is successful,
  //the function in the constructor will get called and navigate to Portfolio Summary    
  @action
  async setupGoogleSignin() {
    try {
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: 'XXXXXXX.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: 'XXXXXX', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
    }
    catch (err) {
      console.log("Google signin error", err.code, err.message);
    }
  }

@action
 async GooglesignIn() {
  try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        const credential = Firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
        Firebase.auth().signInWithCredential(credential);
        const currentUser = await Firebase.auth().signInWithCredential(credential);
        var user = Firebase.auth().currentUser;

        if(user) {
             this._user = user;
             this._userId = user.uid;
        }
      }
    } catch (error) {
      this.error = error.message;
      console.log("GoogleSign error: " + error.message)
    }
  }

  @action
  async onLogoffGoogle() {
   try {
      await GoogleSignin.signOut();
      return await this.signOut();
    } catch (error) {
      console.log(error)
     this.error = error.message;
    }
  }

@action
signOut() {
    return Firebase.auth().signOut().then(f => {     
      this.user = this.userId = null;
    }).catch(function (error) {
      console.log(error)
      this.error = error.message;
    });
  }

  @action
  signIn(email, password) {
    return Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (result) {
        this.user = result.user;
        this.userId = result.user.uid;
      }).catch(function (error) {
        console.log(error)
        return this.error = error.message;
      });
  }

  @action
  signInSendEmailLink(email) {
  const actionCodeSettings = {
    url: 'https://YOUR_BUNDLE_ID',
    handleCodeInApp: true, // must always be true for sendSignInLinkToEmail
    iOS: {
      bundleId: 'YOUR_BUNDLE_ID',
    },
  };
  
  return Firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    .then(function (result) {
      this.user = result.user;
      this.userId = result.user.uid;
    }).catch(function (error) {
      console.log(error)
      this.error = error.message;
    });
}

  @action
  signUp(email, password) {
    return Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (result) {
        this.user = result.user;
        this.userId = result.user.uid;
      }).catch(function (error) {
        console.log(error)
        this.error = error.message;
      });
  }

  @action
  forgotPassword(email) {
    return Firebase.auth().sendPasswordResetEmail(email)
  }

  @computed
  get userId() {
    return this._userId === '' ? false : this._userId
  }
  set userId(userId) {
    this._userId = userId
  }

  @computed
  get user() {
    return this._user || {}
  }
  set user(user) {
    this._user = user
  }

  @computed
  get error() {
    return this._error || {}
  }
  set error(data) {
    this._error = data
  }
}
export default new AuthStore()
