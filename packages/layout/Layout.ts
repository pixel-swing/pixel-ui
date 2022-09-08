import { defineComponent, resolveComponent, h, VNode, Component } from 'vue'

const hasTag = (slots, tagName) => {
  if (slots && slots.default) {
    const vNodes: VNode[] = slots.default()
    return vNodes.some((vNode) => {
      const tag = (vNode.type as Component).name
      return tag === tagName
    })
  }
  return false
}

const BaseLayout = ({ name, tag, className }) =>
  defineComponent({
    name,
    props: ['height', 'width'],
    setup(props, { slots }) {
      const Tag = resolveComponent(tag)
      const layoutOptions = {
        class: {
          [className]: className,
          'px-layout-has-sider': hasTag(slots, 'PSider'),
        },
        style: {
          height: `${props.height}px`,
          width: `${props.width}px`,
        },
      }
      return () => h(Tag, layoutOptions, slots.default && slots.default())
    },
  })

const Header = BaseLayout({
  name: 'PHeader',
  tag: 'header',
  className: 'px-layout-header',
})
const Content = BaseLayout({
  name: 'PContent',
  tag: 'main',
  className: 'px-layout__content',
})
const Footer = BaseLayout({
  name: 'PFooter',
  tag: 'footer',
  className: 'px-layout__footer',
})
const Sider = BaseLayout({
  name: 'PSider',
  tag: 'aside',
  className: 'px-layout__sider',
})
const Layout = BaseLayout({
  name: 'PLayout',
  tag: 'section',
  className: 'px-layout',
})

Layout.PxHeader = Header
Layout.PxContent = Content
Layout.PxFooter = Footer
Layout.PxSider = Sider

export default Layout
