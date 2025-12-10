# Documentación de la API de Carrito de Compras

La ruta base para todos los endpoints del carrito es `API_URL/api/cart`.

## 1. Obtener Carrito

Obtiene el carrito de compras activo para el usuario (usando userId del token) o la sesión actual (usando sessionId si no hay userId). Si no existe un carrito activo, se crea uno nuevo.

**Ruta:** `GET API_URL/api/cart`

**Método:** GET

### Parámetros de Consulta (Query Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| userId | String | Opcional | ID del usuario autenticado. (Normalmente se obtiene del authMiddleware). |
| sessionId | String | Opcional | ID de sesión para usuarios no registrados. Se requiere al menos uno: userId o sessionId. |

### Ejemplo de Petición

```http
GET /api/cart?userId=60d5ec49c6f2e80015b6d5f7 HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
```

### Respuesta Esperada (200 OK)

```json
{
    "_id": "60d5ec49c6f2e80015b6d6a1",
    "userId": "60d5ec49c6f2e80015b6d5f7",
    "sessionId": null,
    "items": [
        {
            "productId": "70d6a2f3a4b5c6d7e8f9a0b1",
            "title": "T-shirt Cool",
            "price": 25.50,
            "quantity": 2,
            "image": "url-to-image-tshirt.jpg",
            "_id": "60d5ec49c6f2e80015b6d6a2"
        }
    ],
    "status": "active",
    "createdAt": "2021-06-25T10:00:00.000Z",
    "updatedAt": "2021-06-25T10:00:00.000Z",
    "__v": 0
}
```

---

## 2. Agregar Producto al Carrito

Agrega un nuevo producto o incrementa la cantidad si el producto ya existe en el carrito.

**Ruta:** `POST API_URL/api/cart/add`

**Método:** POST

### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| userId | String | Opcional | ID del usuario. |
| sessionId | String | Opcional | ID de sesión. Se requiere al menos uno. |
| productId | String | Sí | ID del producto a agregar. |
| title | String | Sí | Nombre del producto. |
| price | Number | Sí | Precio del producto. |
| quantity | Number | Sí | Cantidad a agregar (debe ser >0). |
| image | String | Sí | URL de la imagen del producto. |

### Ejemplo de Petición y Payload

```http
POST /api/cart/add HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
Content-Type: application/json

{
    "userId": "60d5ec49c6f2e80015b6d5f7",
    "productId": "90e7f4g5h6i7j8k9l0m1n2o3",
    "title": "Jeans Slim Fit",
    "price": 59.99,
    "quantity": 1,
    "image": "url-to-image-jeans.jpg"
}
```

### Respuesta Esperada (200 OK)

Devuelve el objeto del carrito actualizado, incluyendo el nuevo ítem o la cantidad modificada.

```json
{
    "items": [
        {
            "productId": "70d6a2f3a4b5c6d7e8f9a0b1",
            "title": "T-shirt Cool",
            "price": 25.50,
            "quantity": 2,
            "image": "url-to-image-tshirt.jpg",
            "_id": "60d5ec49c6f2e80015b6d6a2"
        },
        {
            "productId": "90e7f4g5h6i7j8k9l0m1n2o3",
            "title": "Jeans Slim Fit",
            "price": 59.99,
            "quantity": 1,
            "image": "url-to-image-jeans.jpg",
            "_id": "60d5ec49c6f2e80015b6d6a3"
        }
    ]
}
```

---

## 3. Actualizar Cantidad del Ítem del Carrito

Permite modificar la cantidad de un producto existente o eliminarlo si la nueva cantidad es ≤0.

**Ruta:** `PUT API_URL/api/cart/update`

**Método:** PUT

### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| userId | String | Opcional | ID del usuario. |
| sessionId | String | Opcional | ID de sesión. Se requiere al menos uno. |
| productId | String | Sí | ID del producto a actualizar. |
| quantity | Number | Sí | La nueva cantidad. Si es ≤0, el ítem se elimina del carrito. |

### Ejemplo de Petición y Payload (Actualizar a 5 unidades)

```http
PUT /api/cart/update HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
Content-Type: application/json

{
    "userId": "60d5ec49c6f2e80015b6d5f7",
    "productId": "70d6a2f3a4b5c6d7e8f9a0b1",
    "quantity": 5 
}
```

### Respuesta Esperada (200 OK)

Devuelve el objeto del carrito actualizado con la nueva cantidad.

```json
{
    "items": [
        {
            "productId": "70d6a2f3a4b5c6d7e8f9a0b1",
            "title": "T-shirt Cool",
            "price": 25.50,
            "quantity": 5,
            "image": "url-to-image-tshirt.jpg",
            "_id": "60d5ec49c6f2e80015b6d6a2"
        }
    ]
}
```

---

## 4. Eliminar Producto del Carrito

Elimina por completo un tipo de producto específico del carrito.

**Ruta:** `DELETE API_URL/api/cart/remove`

**Método:** DELETE

### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| userId | String | Opcional | ID del usuario. |
| sessionId | String | Opcional | ID de sesión. Se requiere al menos uno. |
| productId | String | Sí | ID del producto a eliminar. |

### Ejemplo de Petición y Payload

```http
DELETE /api/cart/remove HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
Content-Type: application/json

{
    "userId": "60d5ec49c6f2e80015b6d5f7",
    "productId": "90e7f4g5h6i7j8k9l0m1n2o3"
}
```

### Respuesta Esperada (200 OK)

Devuelve el objeto del carrito sin el ítem especificado.

```json
{
    "items": [
        {
            "productId": "70d6a2f3a4b5c6d7e8f9a0b1",
            "title": "T-shirt Cool",
            "price": 25.50,
            "quantity": 5,
            "image": "url-to-image-tshirt.jpg",
            "_id": "60d5ec49c6f2e80015b6d6a2"
        }
    ]
}
```

---

## 5. Vaciar Carrito

Elimina todos los productos del carrito, dejándolo vacío.

**Ruta:** `DELETE API_URL/api/cart/clear`

**Método:** DELETE

### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| userId | String | Opcional | ID del usuario. |
| sessionId | String | Opcional | ID de sesión. Se requiere al menos uno. |

### Ejemplo de Petición y Payload

```http
DELETE /api/cart/clear HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
Content-Type: application/json

{
    "userId": "60d5ec49c6f2e80015b6d5f7"
}
```

### Respuesta Esperada (200 OK)

Devuelve el objeto del carrito con el arreglo items vacío.

```json
{
    "items": []
}
```