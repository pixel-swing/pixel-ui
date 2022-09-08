const fs = require('fs').promises
const fse = require('fs-extra')
const path = require('path')
const config = require('./config')

;(async () => {
  const distDir = path.resolve(__dirname, '../packages/dist')
  if (!(await fs.stat(distDir).catch(() => false))) {
    await fs.mkdir(distDir)
  }
  for (const { name: iconSetName, src, normalizeName, filter, iconify } of config) {
    const outPath = path.resolve(__dirname, '../packages/dist', iconSetName)
    if (!(await fs.stat(outPath).catch(() => false))) {
      await fs.mkdir(outPath)
    }
    const icons = []
    console.log(`${iconSetName}`)
    const nameSet = new Set()
    if (iconify) {
      console.log('use iconify source')
      const { icons: iconifyIcons, width: generalWidth, height: generalHeight } = iconify
      Object.keys(iconifyIcons).forEach((iconKey) => {
        const { body, width, height, hidden } = iconifyIcons[iconKey]
        if (hidden) return
        const normalizedName = normalizeName(iconKey)
        const lowerName = normalizedName.toLowerCase()
        if (nameSet.has(lowerName)) {
          // avoid errors in non-case-sensitive os
          return
        } else {
          nameSet.add(lowerName)
        }
        let mergedWidth = width || generalWidth
        let mergedHeight = height || generalHeight
        if (mergedWidth === undefined) {
          console.log('error width', iconSetName, iconKey)
        }
        if (mergedHeight === undefined) {
          console.log('error width', iconSetName, iconKey)
        }
        const clearedBody = body.replace(/class="[^"]*"/g, '')
        icons.push({
          name: normalizedName,
          svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${mergedWidth} ${mergedHeight}">${clearedBody}</svg>`,
          reactSvg: `<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${mergedWidth} ${mergedHeight}">${clearedBody}</svg>`,
        })
      })
    }
    icons.sort((v1, v2) => {
      if (v1.name < v2.name) return -1
      if (v1.name > v2.name) return 1
      return 0
    })
    const iconNames = icons.map((v) => v.name)
    // await generateSvg(icons, outPath)
    await generateVue3(icons, iconNames, outPath)
  }
})()

const generateVue3 = async (icons, iconNames, basePath) => {
  const tempPath = path.resolve(basePath, 'vue3')
  await fse.mkdir(tempPath)
  // generate .vue (lang = ts)
  for (const { name, svg } of icons) {
    await fse.writeFile(
      path.resolve(tempPath, `${name}.vue`),
      `<template>${svg}</template>
      <script lang="ts">
      import { defineComponent } from 'vue'
      export default defineComponent({
        name: '${name}'
      })
      </script>`,
    )
  }
}
