import { vuePlugin } from './vue-plugin'
import { mdContentParser } from '../utils/md-content-parser'

const fileRegex = /\.(md|entry)$/

export const transformMdPlugin = () => {
  return {
    name: 'transform-md-plugin',
    transform(code, id) {
      if(fileRegex.test(id)) {
        return mdContentParser(id)
      }
    },
    async handleHotUpdate(ctx) {
      const { file } = ctx
      if (fileRegex.test(file)) {
        const code = await mdContentParser(file)
        // console.log(code)
        return vuePlugin.handleHotUpdate({
          ...ctx,
          read: () => code
        })
      }
    }
  }
}