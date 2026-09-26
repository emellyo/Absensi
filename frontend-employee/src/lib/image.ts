const MAX_DIMENSION = 800
const QUALITY = 0.8

/**
 * Perkecil foto sebelum diunggah: sisi terpanjang maksimal 800px, JPEG 80%.
 * Foto kamera HP (5-10 MB) biasanya turun ke kisaran 100-200 KB.
 * Bila browser gagal membaca file (misal HEIC), file asli dikirim apa adanya
 * dan validasi format di server yang akan menolaknya.
 */
export async function compressImage(file: File): Promise<File> {
  let bitmap: ImageBitmap
  try {
    // 'from-image' menghormati orientasi EXIF sehingga foto HP tidak miring.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return file
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    return file
  }

  // JPEG tidak punya transparansi; tanpa ini area transparan PNG jadi hitam.
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY),
  )

  // Foto yang sudah kecil bisa malah membesar setelah di-encode ulang.
  if (!blob || blob.size >= file.size) return file

  const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${name}.jpg`, { type: 'image/jpeg' })
}
