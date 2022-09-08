import { defineComponent, h, computed } from 'vue'
import type { Size, Type } from './interface'

interface PropsType {
  size?: Size
  type?: Type
}
const buttonProps = {
  size: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: 'default',
  },
  hoverType: {
    type: String,
    default: 'deault',
  },
}

export default defineComponent({
  props: buttonProps,
  setup(props, { slots }) {
    const classes = computed(() => {
      const { size, type, hoverType } = props
      return {
        ['p-button']: true,
        [`p-button--${size}`]: size,
        [`p-button--${type}`]: type,
        [`hover-type--${hoverType}`]: hoverType,
      }
    })
    return {
      classes,
    }
    // return () => h(tag, buttonAttrs, buttonContent)
  },
  render() {
    const tag = 'button'
    const buttonOptions = {
      class: this.classes,
      type: 'button',
    }
    const buttonContent = h(
      'md-button-content',
      {
        attrs: {
          type: 'button',
          mdRipple: '',
          disabled: '',
        },
        props: {
          mdRippleActive: '',
        },
        on: {
          'update:mdRippleActive': (active) => active,
        },
      },
      this.$slots.default(),
    )

    return h(tag, buttonOptions, buttonContent)
  },
})
