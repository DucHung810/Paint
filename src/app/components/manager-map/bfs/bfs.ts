import { Shape } from "../shapes";

const GRID_SIZE = 50; // Kích thước mỗi ô lưới

export const generateGrid = (
  shapes: Shape[],
  width: number,
  height: number
) => {
  const rows = Math.ceil(height / GRID_SIZE);
  const cols = Math.ceil(width / GRID_SIZE);
  const grid = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));

  shapes.forEach((shape) => {
    const startRow = Math.floor(shape.y / GRID_SIZE);
    const startCol = Math.floor(shape.x / GRID_SIZE);
    const endRow = Math.floor((shape.y + shape.height) / GRID_SIZE);
    const endCol = Math.floor((shape.x + shape.width) / GRID_SIZE);

    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        if (grid[i] && grid[i][j] !== undefined) {
          grid[i][j] = 1; // Đánh dấu vật cản
        }
      }
    }
  });

  return grid;
};
