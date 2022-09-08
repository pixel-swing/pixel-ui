import fs from 'fs'
import path from 'path'
import marked from 'marked'
import projectPath from '../utils/project-path'
import { createMdRenderer } from '../utils/md-renderer'

const mdRenderer = createMdRenderer()

const docsBlock = fs
  .readFileSync(path.resolve(__dirname, '.', '..', 'utils', 'DocsTemplate.vue'))
  .toString()

const getContentBlocksOfDocs = (tokens: TokensList) => {
  let template = null
  let script = null
  let style = null
  let title = null
  const contentTokens :any = []
  contentTokens.links = tokens.links
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) {
      title = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'template' || token.lang === 'html')
    ) {
      template = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'script' || token.lang === 'js')
    ) {
      script = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'style' || token.lang === 'css')
    ) {
      style = token.text
    } else {
      contentTokens.push(token)
    }
  }
  return {
    template: template,
    script: script,
    style: style,
    title: title,
    content: marked.parser(contentTokens, {
      renderer: mdRenderer
    })
  }
}

function mergeContentBlocks (contents) {
  const mergedContentBlocks = {
    ...contents
  }
  mergedContentBlocks.title = contents.title
  mergedContentBlocks.content = contents.content
  mergedContentBlocks.code = ''
  if (contents.template) {
    mergedContentBlocks.code += `<template>\n${contents.template
      .split('\n')
      .map((line) => (line.length ? '  ' + line : line))
      .join('\n')}\n</template>`
  }
  if (contents.script) {
    if (contents.template) mergedContentBlocks.code += '\n\n'
    mergedContentBlocks.code += `<script>
${contents.script}
</script>`
  }
  if (contents.style) {
    if (contents.template || contents.script) mergedContentBlocks.code += '\n\n'
    mergedContentBlocks.code += `<style>
${contents.style}
</style>`
  }
  mergedContentBlocks.code = encodeURIComponent(mergedContentBlocks.code)
  return mergedContentBlocks
}




const cssRuleRegex = /([^{}]*)(\{[^}]*\})/g

// simulate scss style
// to remove dep of sass
// xxx {
//   mystyle
// }
function genStyle (sourceStyle) {
  let match
  let matched = false
  const rules = []

  while ((match = cssRuleRegex.exec(sourceStyle)) !== null) {
    matched = true
    const selector = match[1]
    const body = match[2]
    rules.push(
      selector
        .split(',')
        .map((part) => `.demo-card__view ${part}, .naive-ui-doc ${part}`)
        .join(',') + body
    )
  }
  if (!matched) return null
  return '<style scoped>\n' + rules.join('\n') + '</style>'
}

function genVueComponent (contents, fileName, relativeUrl, noRunning = false) {
  const docsFileNameReg = /<!--DOCS_FILE_NAME-->/g
  const relativeUrlReg = /<!--URL-->/g
  const titleReg = /<!--TITLE_SLOT-->/g
  const contentReg = /<!--CONTENT_SLOT-->/
  const codeReg = /<!--CODE_SLOT-->/
  const scriptReg = /<!--SCRIPT_SLOT-->/
  const styleReg = /<!--STYLE_SLOT-->/
  const docsReg = /<!--DOCS_SLOT-->/
  let src = docsBlock
  src = src.replace(docsFileNameReg, fileName)
  src = src.replace(relativeUrlReg, relativeUrl)
  if (contents.content) {
    src = src.replace(contentReg, contents.content)
  }
  if (contents.title) {
    src = src.replace(titleReg, contents.title)
  }
  if (contents.code) {
    src = src.replace(codeReg, contents.code)
  }
  if (contents.script && !noRunning) {
    src = src.replace(scriptReg, '<script>\n' + contents.script + '\n</script>')
  }
  if (contents.style) {
    const style = genStyle(contents.style)
    if (style !== null) {
      src = src.replace(styleReg, style)
    }
  }
  if (contents.template) {
    src = src.replace(docsReg, contents.template)
  }
  return src.trim()
}

function getFileName (resourcePath) {
  const dirs = resourcePath.split('/')
  const fileNameWithExtension = dirs[dirs.length - 1]
  return [fileNameWithExtension.split('.')[0], fileNameWithExtension]
}

function compileMdAsComponent (text, { resourcePath, relativeUrl }) {
  const noRunning = /<!--no-running-->/.test(text)
  const tokens = marked.lexer(text)
  const contents = getContentBlocksOfDocs(tokens)
  const mergedContentBlocks = mergeContentBlocks(contents)
  const [fileName] = getFileName(resourcePath)
  const vueComponent = genVueComponent(
    mergedContentBlocks,
    fileName,
    relativeUrl,
    noRunning
  )
  return vueComponent
}


export const mdLoader =  (content, path) => {
  const relativeUrl = path.replace(projectPath + '/', '')
  return compileMdAsComponent(content, {
    relativeUrl,
    resourcePath: path
  })
}

