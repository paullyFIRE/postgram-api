import { createCanvas, loadImage } from 'canvas';

const HEIGHT = 40;
const REPOST_ICON_SIZE = Math.min(50, HEIGHT);
const CANVAS_PADDING = 10;
const FONT_SIZE = 30;
const FONT = `bold ${FONT_SIZE}pt Menlo`;
const CORNER_RADIUS = 20;

export default {
  getWatermarkBuffer: async (instaUsername = ''): Promise<Buffer> => {
    const nameCanvas = createCanvas(500, 500);
    const nameContext = nameCanvas.getContext('2d');

    nameContext.font = FONT;
    const nameWidth = nameContext.measureText(instaUsername).width;

    const width = CANVAS_PADDING + REPOST_ICON_SIZE + nameWidth;

    const watermarkCanvas = createCanvas(width, HEIGHT);
    const watermarkContext = watermarkCanvas.getContext('2d');

    watermarkContext.fillStyle = '#fff';
    watermarkContext.strokeStyle = '#fff';
    watermarkContext.clearRect(0, 0, width, HEIGHT);
    watermarkContext.fillRect(0, CORNER_RADIUS, width, HEIGHT);

    watermarkContext.lineJoin = 'round';
    watermarkContext.lineWidth = CORNER_RADIUS;

    watermarkContext.strokeRect(
      0 + CORNER_RADIUS / 2 - CORNER_RADIUS,
      0 + CORNER_RADIUS / 2,
      width,
      HEIGHT,
    );

    const repostIconImage = await loadImage('repost-icon.png');

    watermarkContext.drawImage(
      repostIconImage,
      CANVAS_PADDING,
      HEIGHT / 2 - REPOST_ICON_SIZE / 2,
      REPOST_ICON_SIZE,
      REPOST_ICON_SIZE,
    );

    watermarkContext.font = FONT;
    watermarkContext.fillStyle = '#000';
    watermarkContext.textAlign = 'center';
    watermarkContext.textBaseline = 'middle';
    const textX = CANVAS_PADDING + REPOST_ICON_SIZE + nameWidth / 2;

    watermarkContext.fillText(instaUsername, textX, HEIGHT / 2);

    return watermarkCanvas.toBuffer('image/png');
  },
};
