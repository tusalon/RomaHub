// utils/cloudinary-upload.js
// Sube fotos de productos/cursos directo desde el navegador a Cloudinary,
// sin tocar Supabase Storage (que solo trae 1GB gratis para TODO el proyecto).
// Comprime en canvas antes de subir: menos peso, menos creditos gastados.
//
// Requiere un upload preset SIN FIRMA en Cloudinary (Settings > Upload >
// Upload presets > Add > Signing Mode: Unsigned). El preset no es secreto:
// solo permite subir a una carpeta fija, nunca borrar ni leer nada ajeno.
window.RomaUpload = (function () {
  var CLOUD_NAME = window.CLOUDINARY_CLOUD_NAME || 'CONFIGURAR_CLOUD_NAME';
  var UPLOAD_PRESET = 'romahub_productos';
  var FOLDER = 'romahub/productos';
  var MAX_ORIGINAL_MB = 8;
  var MAX_DIMENSION = 1000;
  var JPEG_QUALITY = 0.72;

  function quitarAcentos(texto) {
    // Sin regex de rango unicode (fragil en algunos editores/encodings):
    // normaliza a NFD y descarta los code points de marcas combinantes
    // (U+0300 a U+036F) caracter por caracter.
    var normalizado = texto.normalize('NFD');
    var limpio = '';
    for (var i = 0; i < normalizado.length; i++) {
      var code = normalizado.charCodeAt(i);
      if (code < 0x0300 || code > 0x036f) limpio += normalizado[i];
    }
    return limpio;
  }

  function slugArchivo(valor) {
    return quitarAcentos(String(valor || 'producto').toLowerCase())
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'producto';
  }

  function cargarImagenEnCanvas(file) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      var objectUrl = URL.createObjectURL(file);
      image.onload = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudo leer la imagen'));
      };
      image.src = objectUrl;
    });
  }

  async function comprimir(file) {
    var image = await cargarImagenEnCanvas(file);
    var scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
    var width = Math.max(1, Math.round(image.width * scale));
    var height = Math.max(1, Math.round(image.height * scale));
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(blob || file);
      }, 'image/jpeg', JPEG_QUALITY);
    });
  }

  // Sube una imagen de producto/curso. Devuelve la URL segura de Cloudinary
  // (lo unico que se guarda en negocios.imagen_url) o null si falla.
  async function subirImagenProducto(file, etiqueta) {
    if (!file) return null;
    if (!file.type || !file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen.');
    }
    if (file.size > MAX_ORIGINAL_MB * 1024 * 1024) {
      throw new Error('La imagen no puede superar los ' + MAX_ORIGINAL_MB + 'MB.');
    }
    if (!CLOUD_NAME || CLOUD_NAME === 'CONFIGURAR_CLOUD_NAME') {
      throw new Error('Falta configurar CLOUDINARY_CLOUD_NAME en utils/supabase-config.js.');
    }

    var imagenComprimida = await comprimir(file);
    var formData = new FormData();
    formData.append('file', imagenComprimida, slugArchivo(etiqueta) + '-' + Date.now() + '.jpg');
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', FOLDER);
    formData.append('tags', 'romahub,producto');

    var response = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      var errorText = await response.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error('No se pudo subir la imagen. Intenta de nuevo.');
    }

    var data = await response.json();
    return data.secure_url;
  }

  return { subirImagenProducto: subirImagenProducto };
})();
