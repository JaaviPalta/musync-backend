import multer from "multer";

// 4 MB, no 5 — probado contra el backend real en Vercel: su límite de
// payload para funciones serverless rechaza el request ANTES de que
// llegue a este código (413 Request Entity Too Large) en algún punto
// entre 4.0 y 4.3 MB. Con el límite en 5 MB, cualquier imagen entre ~4.3
// y 5 MB pasaba nuestra validación pero igual fallaba, con un error de
// red genérico en vez del mensaje claro de abajo.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Solo se permiten imágenes JPG, PNG o WebP"));
    }

    cb(null, true);
  }
});

export default upload;