import { compose, concat, propOr, useWith, find, propEq } from 'ramda'
import * as files from '@/utils/supported-files/files.json'

/**
 * Lookup the svg per icon key
 * @param {String} icon
 * @param {Array} files
 * @returns {String}
 */
const getSvgIcon = compose(
  concat('/file-icons/'),
  propOr('icon-generic.svg', 'SVG'),
  useWith(find, [propEq('Icon')])
)

export default {
  methods: {
    /**
     * Get the svg image
     * @param {String} icon
     * @param {String} packageType
     * @returns {String}
     */
    fileIcon(icon, packageType) {
      if (packageType === 'Directory') {
        return '/file-icons/icon-folder.svg'
      }

      if (packageType === 'ExternalFile') {
        return '/file-icons/icon-linked-file.svg'
      }

      const list = Array.isArray(files) ? files : files.default
      return getSvgIcon(icon, list)
    }
  }
}
