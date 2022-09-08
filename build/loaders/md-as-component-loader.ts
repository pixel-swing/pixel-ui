import path from 'path'
import fse from 'fs-extra'
import marked from 'marked'
import camelCase from 'lodash/camelCase'
import projectPath from '../utils/project-path'
import { createMdRenderer } from '../utils/md-renderer'

const mdRenderer = createMdRenderer()

async function resolveDemoTitleInDocs (fileName, demoEntryPath) {
  const demoStr = await fse.readFile(
    path.resolve(projectPath, demoEntryPath, '..', fileName),
    'utf-8'
  )
  return demoStr.match(/# ([^\n]+)/)[1]
}

async function resolveDemoInfos (literal, url, env) {
  const ids = literal
    .split('\n')
    .map((line) => line.trim())
    .filter((id) => id.length)
  const infos = []
  for (const id of ids) {
    const debug = id.includes('debug') || id.includes('Debug')
    if (env === 'production' && debug) {
      continue
    }
    const fileName = `${id}.demo.md`
    const variable = `${camelCase(id)}Demo`
    infos.push({
      id,
      variable,
      fileName,
      title: await resolveDemoTitleInDocs(fileName, url),
      tag: `<${variable} />`,
      debug
    })
  }
  return infos
}

function genDemosTemplate (demoInfos, colSpan) {
  return `<component-demos :span="${colSpan}">${demoInfos
    .map(({ tag }) => tag)
    .join('\n')}</component-demos>`
}

function genAnchorTemplate (children, options = {}) {
  return `
    <n-anchor
      :bound="16"
      style="width: 144px; position: sticky; top: 32px;"
      offset-target="#doc-layout"
      :ignore-gap="${options.ignoreGap}"
    >
      ${children}
    </n-anchor>
  `
}

function genDemosAnchorTemplate (demoInfos) {
  const links = demoInfos.map(
    ({ id, title, debug }) => `<n-anchor-link
    v-if="(displayMode === 'debug') || ${!debug}"
    title="${title}"
    href="#${id}"
  />`
  )
  return genAnchorTemplate(links.join('\n'))
}

function genPageAnchorTemplate (tokens) {
  const titles = tokens
    .filter((token) => token.type === 'heading' && token.depth === 2)
    .map((token) => token.text)
  const links = titles.map((title) => {
    const href = title.replace(/ /g, '-')
    return `<n-anchor-link title="${title}" href="#${href}"/>`
  })
  return genAnchorTemplate(links.join('\n'), { ignoreGap: true })
}

function genScript (demoInfos, components = [], url, forceShowAnchor) {
  const showAnchor = !!(demoInfos.length || forceShowAnchor)
  const importStmts = demoInfos
    .map(({ variable, fileName }) => `import ${variable} from './${fileName}'`)
    .concat(components.map(({ importStmt }) => importStmt))
    .join('\n')
  const componentStmts = demoInfos
    .map(({ variable }) => variable)
    .concat(components.map(({ ids }) => ids).flat())
    .join(',\n')
  const script = `<script>
${importStmts}
import { computed } from 'vue'
import { useMemo } from 'vooks'
import { useDisplayMode } from '/demo/store'
import { useIsMobile } from '/demo/utils/composables'

export default {
  components: {
    ${componentStmts}
  },
  setup () {
    const isMobileRef = useIsMobile()
    const showAnchorRef = useMemo(() => {
      if (isMobileRef.value) return false
      return ${showAnchor}
    })
    const useSmallPaddingRef = isMobileRef
    return {
      showAnchor: showAnchorRef,
      displayMode: useDisplayMode(),
      wrapperStyle: computed(() => {
        return !useSmallPaddingRef.value
          ? 'display: flex; flex-wrap: nowrap; padding: 32px 24px 56px 56px;'
          : 'padding: 16px 16px 24px 16px;'
      }),
      contentStyle: computed(() => {
        return showAnchorRef.value
          ? 'width: calc(100% - 180px); margin-right: 36px;'
          : 'width: 100%; padding-right: 12px;'; 
      }),
      url: ${JSON.stringify(url)}
    }
  }
}
</script>`
  return script
}

async function compileMdFileAsComponent (
  text,
  url,
  env = 'development'
) {
  // const forceShowAnchor = !!~text.search('<!--anchor:on-->')
  // const colSpan = ~text.search('<!--single-column-->') ? 1 : 2
  const tokens = marked.lexer(text)
  // resolve external components
  // const componentsIndex = tokens.findIndex(
  //   (token) => token.type === 'code' && token.lang === 'component'
  // )
  // let components = []
  // if (~componentsIndex) {
  //   components = tokens[componentsIndex].text
  //   components = components
  //     .split('\n')
  //     .map((component) => {
  //       const [ids, importStmt] = component.split(':')
  //       if (!ids.trim()) throw new Error('No component id')
  //       if (!importStmt.trim()) throw new Error('No component source url')
  //       return {
  //         ids: ids.split(',').map((id) => id.trim()),
  //         importStmt: importStmt.trim()
  //       }
  //     })
  //     .filter(({ ids, importStmt }) => ids && importStmt)
  //   tokens.splice(componentsIndex, 1)
  // }
  // // add edit on github button on title
  // const titleIndex = tokens.findIndex(
  //   (token) => token.type === 'heading' && token.depth === 1
  // )
  // if (titleIndex > -1) {
  //   const titleText = JSON.stringify(tokens[titleIndex].text)
  //   const btnTemplate = `<edit-on-github-header relative-url="${url}" text=${titleText}></edit-on-github-header>`
  //   tokens.splice(titleIndex, 1, {
  //     type: 'html',
  //     pre: false,
  //     text: btnTemplate
  //   })
  // }
  // // resolve demos, debug demos are removed from production build
  // const demosIndex = tokens.findIndex(
  //   (token) => token.type === 'code' && token.lang === 'demo'
  // )
  // let demoInfos = []
  // if (~demosIndex) {
  //   demoInfos = await resolveDemoInfos(tokens[demosIndex].text, url, env)
  //   tokens.splice(demosIndex, 1, {
  //     type: 'html',
  //     pre: false,
  //     text: genDemosTemplate(demoInfos, colSpan)
  //   })
  // }
  const docMainTemplate = marked.parser(tokens, {
    gfm: true,
    renderer: mdRenderer
  })
  // generate page
  const docTemplate = `
<template>
  <div
    class="doc"
    :style="wrapperStyle"
  >
    <div :style="contentStyle">
      ${docMainTemplate}
    </div>
    
  </div>
</template>`
  // const docScript = await genScript(demoInfos, components, url, forceShowAnchor)
  return `${docTemplate}`
}


export const mdAsComponentLoader =  (content, path) => {
  const relativeUrl = path.replace(projectPath + '/', '')
  const env = process.env.NODE_ENV
  return compileMdFileAsComponent(content, relativeUrl, env)
}

