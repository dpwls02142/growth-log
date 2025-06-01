import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { h } from 'vue'

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout)
    }
} 