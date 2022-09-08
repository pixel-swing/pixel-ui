const { camelCase, upperFirst } = require('lodash')
const { locate } = require('@iconify/json')

module.exports = [
  {
    name: 'fa',
    description: (prefix) =>
      `${prefix} integrated from [\`font-awesome\`](https://github.com/FortAwesome/Font-Awesome)`,
    normalizeName: (name) => {
      const normalizedName = upperFirst(camelCase(name))
      if (/^\d/.test(normalizedName)) return 'Fa' + normalizedName
      return normalizedName
    },
    iconify: (() => {
      function appendSize(iconify) {
        const { icons, width, height } = iconify
        Object.keys(icons).forEach((key) => {
          if (icons[key].width === undefined) {
            icons[key].width = width
          }
          if (icons[key].height === undefined) {
            icons[key].height = height
          }
        })
      }
      const regularIconify = require(locate('fa-regular'))
      const regular = Object.keys(regularIconify.icons).reduce(
        (mockedIconify, key) => {
          mockedIconify.icons[key + '-regular'] = regularIconify.icons[key]
          return mockedIconify
        },
        { ...regularIconify, icons: {} },
      )
      const solid = require(locate('fa-brands'))
      const brands = require(locate('fa-solid'))
      ;[regular, solid, brands].forEach(appendSize)
      return {
        info: solid.info,
        icons: {
          ...regular.icons,
          ...solid.icons,
          ...brands.icons,
        },
      }
    })(),
  },
]
