import { title } from 'process'
import { defineComponent, resolveComponent, h } from 'vue'
import IconBase from '../px-icons/IconBase.vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  setup(props, { slots }) {
    const { active, opened, disabled } = props
    const subMenuOptions = {
      class: {
        'px-sub-menu': true,
        'is-active': active,
        'is-opened': opened,
        'is-disabled': disabled,
      },
    }
    const renderSubContent = () => {
      const opts = {
        title: {
          class: 'px-sub-menu__title',
        },
        content: {
          class: 'px-menu',
        },
      }
      const titleVNode = [
        [h(IconBase, { class: 'px-icon', iconName: props.iconName }, null), h('span', {}, props.title)] ||
          slots.title?.(),
        ,
        h('i', { class: 'px-sub-menu__icon-arrow' }, null),
      ]
      const subMenuContent = [h('div', opts.title, titleVNode), h('ul', opts.content, slots.default?.())]
      return subMenuContent
    }

    return () => h('li', subMenuOptions, renderSubContent())
  },
})
