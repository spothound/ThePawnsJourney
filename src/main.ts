import { createApp, type Plugin } from 'vue';
import App from './App.vue';
import '@/assets/styles/index.css';
import vue3GoogleLogin from 'vue3-google-login';
import router from './plugins/router.js';
import CookieConsentVue from './plugins/static_import/CookieConsentVue.ts'
import cookieConsentConfig from './cookieConsentConfig.js';
import VueGtag from 'vue-gtag';

const apiUrl = import.meta.env.VUE_APP_API_URL || 'https://api.thepawnsjourney.live';

const app = createApp(App);

Object.values(
  import.meta.glob<Plugin>('./plugins/*.ts', {
    eager: true,
    import: 'default',
  }),
).forEach((v) => app.use(v));

app.use(vue3GoogleLogin, {
  clientId: '368514305696-6nuvllac0utemf8ad4ch38j6h002ih3g.apps.googleusercontent.com',
});

app.use(router).use(CookieConsentVue, cookieConsentConfig);

app.use(VueGtag, {
  config: {
    id: 'G-SE7XN0JDRV',
  },
}, router);

fetch(`${apiUrl}/`);

app.mount('#app');
