import { createApp, h } from 'vue'
import { RouterView } from 'vue-router'

import { docsRouter } from './docs/router'
import './styles/style.css'

createApp({
  name: 'VisionDocsRoot',
  render: () => h(RouterView),
})
  .use(docsRouter)
  .mount('#app')
