import { getTerrainHeight } from './Ground'

export function getTerrainY(x, z, offset = 0) {
  return getTerrainHeight(x, z) + offset
}

/* Tambahkan parameter `out` opsional agar caller bisa
   menghindari alokasi array per frame. */
export function getTerrainPosition(
  position = [0, 0, 0],
  offset = 0,
  out = [0, 0, 0]
) {
  const [x, , z] = position
  out[0] = x
  out[1] = getTerrainY(x, z, offset)
  out[2] = z
  return out
}