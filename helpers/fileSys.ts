import { IMAGE_NAME, Path } from '../constants'
import fs from 'fs'

/**
 * function for upload images
 * @param name enum
 * @param id identifier
 * @param file string base64
 * @returns boolean
 */
export const imgUpload = (name: IMAGE_NAME, id: number, file: string): boolean => {
  !fs.existsSync(Path.IMG) &&
    fs.mkdir(Path.IMG, { recursive: true }, (err) => {
      if (err) return false
    })

  fs.writeFile(Path.IMG + `${name}_${id}.png`, file, 'base64', () => false)

  return true
}

/**
 * open image
 * @param fileName string image_1.png
 * @returns base64
 */
export const imgOpen = (name: IMAGE_NAME, id: number): string => {
  try {
    return (
      'data:image/png;base64,' +
      fs.readFileSync(Path.IMG + `${name}_${id}.png`, { encoding: 'base64' })
    )
  } catch {
    return ''
  }
}
