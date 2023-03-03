export const fillRect = (x, y, w, h, context, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}