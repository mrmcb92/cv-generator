// Reads an image file, center-crops it to a square and resizes it to
// SIZE px, returning a JPEG data URL small enough to live in localStorage.

const SIZE = 512;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function processPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Fișierul nu este o imagine"));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error("Imaginea depășește 10 MB"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas indisponibil"));
        return;
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Imaginea nu a putut fi citită"));
    };
    img.src = url;
  });
}
