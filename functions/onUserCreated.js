const functions = require('firebase-functions');
const admin = require('./admin');

module.exports = functions.auth.user().onCreate((user) => {
  var email = user.email;
  var create_date = new Date().getTime();

// Uncomment to create starting Portfolio
  var postsRef = admin.database().ref('portfolios/' + user.uid).push();

  var postId = postsRef.key;
  admin.database().ref('portfolios/' + user.uid + '/' + postId).set({
    id: postId,
    portfolioName: 'My First Portfolio',
    createdAt: create_date,
  })

  return admin.database().ref('users/' + user.uid).update({
    email: email && email.toLowerCase ? email.toLowerCase() : email,
    uid: user.uid,
    createdAt: create_date,
    lastUpdateAt: create_date,
    removeAds: false,
    maxPortfolios: 3,
    maxTrades: 100,
    subscribeToEmail: false,
    activeUser: true,
    iexData: {
      iexDevURL: 'https://sandbox.iexapis.com',
      iexProdURL: 'https://cloud.iexapis.com',
      iexProduction: "pk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      iexSandbox: "Tsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      iexUseProduction: true
    }
  });
});
