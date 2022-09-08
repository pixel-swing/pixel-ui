import { createApp } from 'vue'
import { installDocsComponents } from './setup'
import createVueRouter from './router/'
import App from './App.vue'
import '../packages/_themes/index.styl'

import { PxIcon } from 'px-icons'

const app = createApp(App)
const router = createVueRouter()
app.use(router)
installDocsComponents(app)
app.component('PxIcon', PxIcon)

router.isReady().then(() => {
  app.mount('#app')
})
