import { defineComponent, h } from 'vue'

export default defineComponent({
  setup(props, { slots }) {
    const options = {
      class: 'px-menu-item',
    }
    return () => h('li', options, slots.default?.())
  },
})
