import { createApp } from 'vue'

import MenuApplicationDemo from './demos/MenuApplicationDemo.vue'
import { menuApplicationRouter } from './demos/menu-application/router'
import './styles/style.css'
import './demos/menu-application/application.css'

createApp(MenuApplicationDemo).use(menuApplicationRouter).mount('#app')
