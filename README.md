# intercom-chrome-boilerplate
This repository contains the boilerplate code for integrating Intercom’s OAuth process into a Chrome extension. The idea is that by implementing this code into your extension you'll be able to retrieve an Access Token to Intercom's Rest API for the end user's Intercom workspace when they complete the OAuth flow.

# Setup in Intercom's Developer Platform
Before you can use Intercom's OAuth in your extension, you'll first need to register an app with them: https://developers.intercom.com/building-apps/docs

Once you've created and navigated to your app you'll then need to set the app's OAuth Redirect URL: https://developers.intercom.com/building-apps/docs/setting-up-oauth#section-redirect-urls

![image](https://user-images.githubusercontent.com/15332721/63720780-c3af9800-c804-11e9-8a42-0a084e24a077.png)

Chrome's developer docs show how you can find this URL: https://developer.chrome.com/apps/identity#method-getRedirectURL

The only other setup you'll really need to do in order to get this to work is setting the permissions of your app: https://developers.intercom.com/building-apps/docs/setting-up-oauth#section-permissions

![image](https://user-images.githubusercontent.com/15332721/63719472-d4124380-c801-11e9-9693-64184f51b441.png)

Once all of this is set, you can then plug your app's Client ID and Client secret into this boilerplate's code:

![image](https://user-images.githubusercontent.com/15332721/63719789-a2e64300-c802-11e9-8cd6-cf5c6250f0a1.png)

# How to integrate into an extension
There's a few permissions you'll need to include in your manifest.json file:

```
"permissions": [
  "storage",
  "identity",
  "https://api.intercom.io/*"
]
```

This boilerplate makes use of Chrome's storage API where once the Access Token is retrieved it will then be stored locally: https://developer.chrome.com/extensions/storage

All the code for initiating the OAuth process and storing the Access Token can be found in the options.js file. For the most part it just replicates the OAuth flow from Intercom's developer docs: https://developers.intercom.com/building-apps/docs/setting-up-oauth

# Example extension
I also created an example extension that makes use of this OAuth flow to retrieve an Access Token which it then uses to make a request to Intercom's Rest API: https://github.com/alamarcpsc/intercom-lead-creator
