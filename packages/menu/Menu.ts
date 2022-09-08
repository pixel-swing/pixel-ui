import { defineComponent, h } from 'vue'

export default defineComponent({
  emits: ['open'],
  setup(props, { slots, emit }) {
    const handleSubMenuClick = () => {
      emit('open', 'open')
    }
    const menuOptions = {
      class: 'px-menu',
      onClick: handleSubMenuClick,
    }
    return () => h('ul', menuOptions, slots.default?.())
  },
})
