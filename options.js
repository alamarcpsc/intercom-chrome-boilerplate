const CLIENT_ID = '********-****-****-****-************'; //replace with your client_id
const CLIENT_SECRET = '********-****-****-****-************'; //replace with your client_secret

// Checks if there's a saved access token in local storage
chrome.storage.local.get(['token'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve access token');
    console.log(chrome.runtime.lastError);
  }
  else if (storage.token == null) {
    console.log('No token stored');
  }
  else {
    console.log('Successfully retrieved access token');
  }
});

// Set listener for button click
var startAuthentication = document.getElementById('startAuthentication');

// ********************

// Listener to start OAuth process
startAuthentication.onclick = function(element) {
  getAuthorizationCode();
};

// UUID generator used for state parameter
// Source of method:
// https://stackoverflow.com/a/2117523
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
};

// Initiates OAuth process to get an authorization code
// Process in Docs:
// https://developers.intercom.com/building-apps/docs/setting-up-oauth#section-get-the-authorization-code
function getAuthorizationCode() {
  const UUID = uuidv4();
  const REDIRECT_URL = 'https://'+chrome.runtime.id+'.chromiumapp.org';
  const OAUTH_URL = 'https://app.intercom.io/a/oauth/connect?client_id='+CLIENT_ID+'&state='+UUID+'&redirect_uri='+REDIRECT_URL;
  console.log('opening OAuth window');
  chrome.identity.launchWebAuthFlow({
    url: OAUTH_URL,
    interactive: true
  }, function(responseURL) {
    if (responseURL) {
      // Parsing response for authorization code and state
      let responseParams = responseURL.substring(responseURL.indexOf('?')+1);
      responseParams = responseParams.split('&');
      let params = {};
      for ( i = 0, l = responseParams.length; i < l; i++ ) {
        let temp = responseParams[i].split('=');
        params[temp[0]] = temp[1];
      }
      if (params.code && UUID == params.state) {
        console.log('received authorization code');
        // Trades authorization code for Access Token
        getAccessToken(params.code);
      }
      else {
        console.log('Error: no authorization code received');
      }
    }
  });
};

// Trades authorization code for an Access Token
// Process in Docs:
// https://developers.intercom.com/building-apps/docs/setting-up-oauth#section-trade-your-authorization-code-for-an-access-token
function getAccessToken(code) {
  console.log('Trading authorization code for an access token');
  // Post request to eagle endpoint
  const HTTP = new XMLHttpRequest();
  const EAGLE_URL='https://api.intercom.io/auth/eagle/token?code='+code+'&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET;
  HTTP.open('POST', EAGLE_URL, true);
  HTTP.send();
  HTTP.onreadystatechange=(e)=>{
    if (HTTP.readyState == 4 && HTTP.status == 200) {
      console.log('Received access token');
      // Formatting response string into a token
      let responseText = HTTP.responseText
      responseText = responseText.substring(10, responseText.length - 1);
      responseText = responseText.substring(0, responseText.indexOf('"'));
      let token = responseText;
      // Storing the access token
      storeAccessToken(token);
    }
    else if (HTTP.status != 200) {
      console.log('Unexpected non 200 response received, status: ' + HTTP.status);
    }
  }
};

// Stores Access Token in Chrome's local storage
// Chrome sample app where this is done:
// https://github.com/GoogleChrome/chrome-app-samples/blob/22897c98e87435f16d57ddbd7301815d7f4d1180/samples/appsquare/foursquare.js#L20
function storeAccessToken(token) {
  console.log('Storing access token');
  chrome.storage.local.set({token: token}, function() {
    if (chrome.runtime.lastError) {
      console.log('Error: unable to store access token');
      console.log(chrome.runtime.lastError);
    }
    else {
      console.log('Successfully stored access token');
    }
  });
};
