import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSynth from 'vue-synth'
import App from './App.js'

import './styles/index.scss'

import LucideIcon from '@/components/common/LucideIcon.vue'
import EditItem from '@/components/common/EditItem.vue'
import CollapseTitle from '@/components/common/CollapseTitle.vue'
import { ElMessage } from 'element-plus'

import 'virtual:svg-icons-register'

window.__message = ElMessage

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(VueSynth)
app.component('LucideIcon', LucideIcon)
app.component('EditItem', EditItem)
app.component('CollapseTitle', CollapseTitle)

app.mount('#app')
