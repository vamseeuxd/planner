import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling(),
      withComponentInputBinding()
    ),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyB22Td2eK7txawMyX9zlcuPx7-DY_c1BXk',
        authDomain: 'plannerany.firebaseapp.com',
        projectId: 'plannerany',
        storageBucket: 'plannerany.firebasestorage.app',
        messagingSenderId: '457461208092',
        appId: '1:457461208092:web:17c07ce56baa277b43bbd9',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
