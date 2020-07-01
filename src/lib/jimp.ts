import * as Jimp from 'jimp'

const width = 200
const height = 20

const font = Jimp.FONT_SANS_16_BLACK

export default {
  getWatermarkBuffer: (instaUsername = ''): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      new Jimp(width, height, '#FFF', async (_, image) => {
        const name = `@${instaUsername}`

        await Jimp.loadFont(font).then(font => {
          image.print(font, 20, 0, {
            text: name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          });
        });

        image.getBuffer('image/png', (err, buffer) => {
          if (err) reject(err)
          resolve(buffer)
        })
      });
    })
}