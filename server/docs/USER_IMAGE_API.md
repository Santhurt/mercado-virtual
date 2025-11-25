# API de Gestión de Imágenes de Perfil de Usuario

Esta documentación describe los endpoints disponibles para gestionar las imágenes de perfil de los usuarios.

## Base URL

```
http://localhost:3000/api/users
```

## Endpoints

### 1. Subir/Actualizar Imagen de Perfil

Sube o actualiza la imagen de perfil de un usuario. Si el usuario ya tiene una imagen, se elimina la anterior automáticamente.

**Endpoint:** `POST /api/users/:id/profile-image`

**Parámetros de URL:**
- `id` (string, requerido): ID del usuario

**Content-Type:** `multipart/form-data`

**Body:**
- `image` (file, requerido): Archivo de imagen (máximo 2MB)
  - Formatos permitidos: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, etc.

**Validaciones:**
- El archivo debe ser una imagen válida
- Tamaño máximo: 2MB
- Solo se aceptan archivos de tipo imagen

**Ejemplo con cURL:**

```bash
curl -X POST http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image \
  -F "image=@/ruta/a/tu/imagen.jpg"
```

**Ejemplo con Postman:**
1. Método: `POST`
2. URL: `http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image`
3. Body → form-data
4. Key: `image` (tipo: File)
5. Value: Seleccionar archivo de imagen

**Ejemplo con JavaScript (Fetch API):**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**Ejemplo con Axios:**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

axios.post('http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Imagen de perfil actualizada correctamente",
  "data": {
    "profileImage": "/public/users/imagen-1234567890-987654321.jpg"
  }
}
```

**Errores Posibles:**

- **400 Bad Request:** No se recibió ninguna imagen
```json
{
  "success": false,
  "message": "No se recibió ninguna imagen"
}
```

- **400 Bad Request:** Archivo no es una imagen o excede el tamaño
```json
{
  "success": false,
  "message": "Solo se permiten imágenes"
}
```

- **404 Not Found:** Usuario no encontrado
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

- **500 Internal Server Error:** Error al procesar la imagen
```json
{
  "success": false,
  "message": "Error al subir la imagen",
  "error": "Error detallado..."
}
```

---

### 2. Obtener Ruta de Imagen de Perfil

Obtiene la ruta de la imagen de perfil de un usuario.

**Endpoint:** `GET /api/users/:id/profile-image`

**Parámetros de URL:**
- `id` (string, requerido): ID del usuario

**Ejemplo con cURL:**

```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image
```

**Ejemplo con Postman:**
1. Método: `GET`
2. URL: `http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image`

**Ejemplo con JavaScript (Fetch API):**

```javascript
fetch('http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "profileImage": "/public/users/imagen-1234567890-987654321.jpg"
  }
}
```

**Errores Posibles:**

- **404 Not Found:** Usuario no encontrado
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

- **404 Not Found:** Usuario sin imagen de perfil
```json
{
  "success": false,
  "message": "El usuario no cuenta con imagen de perfil"
}
```

- **500 Internal Server Error:** Error al obtener la imagen
```json
{
  "success": false,
  "message": "Error al obtener la imagen",
  "error": "Error detallado..."
}
```

---

### 3. Eliminar Imagen de Perfil

Elimina la imagen de perfil de un usuario (tanto del sistema de archivos como de la base de datos).

**Endpoint:** `DELETE /api/users/:id/profile-image`

**Parámetros de URL:**
- `id` (string, requerido): ID del usuario

**Ejemplo con cURL:**

```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image
```

**Ejemplo con Postman:**
1. Método: `DELETE`
2. URL: `http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image`

**Ejemplo con JavaScript (Fetch API):**

```javascript
fetch('http://localhost:3000/api/users/507f1f77bcf86cd799439011/profile-image', {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Imagen de perfil eliminada correctamente"
}
```

**Errores Posibles:**

- **404 Not Found:** Usuario no encontrado
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

- **404 Not Found:** Usuario sin imagen configurada
```json
{
  "success": false,
  "message": "El usuario no tiene imagen configurada"
}
```

- **500 Internal Server Error:** Error al eliminar la imagen
```json
{
  "success": false,
  "message": "Error al eliminar la imagen",
  "error": "Error detallado..."
}
```

---

## Acceso a las Imágenes

Las imágenes se almacenan en `public/users/` y son accesibles públicamente a través de:

```
http://localhost:3000/public/users/nombre-archivo.jpg
```

La ruta devuelta en las respuestas (`/public/users/...`) puede usarse directamente en el frontend para mostrar la imagen.

**Ejemplo de uso en HTML:**

```html
<img src="http://localhost:3000/public/users/imagen-1234567890-987654321.jpg" alt="Perfil" />
```

---

## Flujo de Trabajo Recomendado

1. **Subir imagen:** Usa `POST /api/users/:id/profile-image` para subir una nueva imagen
2. **Obtener ruta:** Usa `GET /api/users/:id/profile-image` para obtener la ruta actual
3. **Eliminar imagen:** Usa `DELETE /api/users/:id/profile-image` para eliminar la imagen

**Nota:** Al subir una nueva imagen, la anterior se elimina automáticamente del sistema de archivos.

---

## Notas Importantes

- **Tamaño máximo:** 2MB por imagen
- **Formatos permitidos:** Cualquier tipo MIME que comience con `image/` (jpg, png, gif, webp, etc.)
- **Nombres de archivo:** Se generan automáticamente con timestamp y número aleatorio para evitar conflictos
- **Almacenamiento:** Las imágenes se guardan en `public/users/` en el servidor
- **Base de datos:** Solo se almacena la ruta de la imagen, no el archivo en sí

---

## Ejemplo de Flujo Completo

```bash
# 1. Crear un usuario (si no existe)
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "documentNumber": "12345678",
    "age": 25,
    "phone": "3001234567"
  }'

# 2. Subir imagen de perfil (usar el ID del usuario creado)
curl -X POST http://localhost:3000/api/users/USER_ID/profile-image \
  -F "image=@/ruta/a/foto.jpg"

# 3. Obtener la ruta de la imagen
curl -X GET http://localhost:3000/api/users/USER_ID/profile-image

# 4. Ver la imagen directamente
# Abrir en navegador: http://localhost:3000/public/users/nombre-archivo.jpg

# 5. Eliminar la imagen
curl -X DELETE http://localhost:3000/api/users/USER_ID/profile-image
```

