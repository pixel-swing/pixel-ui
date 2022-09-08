import marked from 'marked'
import hljs from 'highlight.js'

export const createMdRenderer = (wrapCodeWithCard = true) => {
  const renderer = new marked.Renderer()
  const overrides = {
    heading: (text, level) => {
      const id = text.replace(/ /g, '-')
      return `<h${level} id="${id}">${text}</h${level}>`
    },
    code: (code, language) => {
      const html = hljs.highlight(code, { language }).value
      const content = `<pre><code>${html}</code></pre>`
      return content
    }
  }

  Object.keys(overrides).forEach((key) => {
    renderer[key] = overrides[key]
  })
  return renderer
}


