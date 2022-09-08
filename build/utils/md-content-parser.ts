import fse from 'fs-extra'
import { mdLoader } from '../loaders/md-loader'
import { mdAsComponentLoader } from '../loaders/md-as-component-loader'

export async function mdContentParser (path) {
  if (path.endsWith('.md')) {
    const code = await fse.readFile(path, 'utf-8')
    // return mdLoader(code, path)
    return mdAsComponentLoader(code, path)
  }
}
