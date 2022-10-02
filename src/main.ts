import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

if (environment.production) {
  enableProdMode();
}

// we add this logic to connect to firebase before we initialising our  angular app
firebase.initializeApp(environment.firebase);
let appInit = false;

firebase.auth().onAuthStateChanged(() => {
  if (!appInit) {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }

  appInit = true;
});

// const appCheck = firebase.appCheck();
// appCheck.activate(environment.FIREBASE_APPCHECK_DEBUG_TOKEN, true);
