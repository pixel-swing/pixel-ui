const transformIndexHtml = (html) => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return html.replace(/__DOCSMAIN__/, '/website/main.prod.js')
    default:
      return html.replace(/__DOCSMAIN__/, '/website/main.dev.js')
  }
}

export const transformIndexHtmlPlugin = () => {
  return {
    name: 'transform-index-html',
    transform (code, id) {
      if (id.endsWith('.html')) {
        return { code: transformIndexHtml(code), map: null }
      }
    },
    transformIndexHtml
  }
}


