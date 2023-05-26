import { createApp } from 'vue';
import './style.css';
import router from './router';
import store from './store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';
import { app as firebaseApp } from './firebase'; // Renamed the Firebase app variable

import App from './App.vue';

// Create the Vue app instance
const vueApp = createApp(App);

// Get the Firebase auth instance
const auth = getAuth(firebaseApp);

// Check if there is a user object stored in local storage
const storedUser = localStorage.getItem('newUser');
if (storedUser) {
  const user = JSON.parse(storedUser);
  user.id = user.uid
  store.commit('setUser', user);
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    store.commit('setUser', user);
    localStorage.setItem('newUser', JSON.stringify(user));
  } else {
    // User is signed out
    store.commit('setUser', null);
    localStorage.removeItem('newUser');
  }
});

// Mount the app with plugins, store, and router
vueApp.use(BootstrapIconsPlugin)
  .use(store)
  .use(router)
  .mount('#app');
