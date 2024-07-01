import { createApp, type Plugin } from 'vue'
import App from './App.vue'
import '@/assets/styles/index.css'
import vue3GoogleLogin from 'vue3-google-login'
const apiUrl = import.meta.env.VUE_APP_API_URL || 'https://api.thepawnsjourney.live';


const app = createApp(App)

Object.values(
  import.meta.glob<Plugin>('./plugins/*.ts', {
    eager: true,
    import: 'default',
  }),
).forEach((v) => app.use(v))

app.use(vue3GoogleLogin, {
  clientId: '368514305696-6nuvllac0utemf8ad4ch38j6h002ih3g.apps.googleusercontent.com'
})

// make a dummy request to the API to bring it up if needed
fetch(`${apiUrl}/`)

app.mount('#app')
