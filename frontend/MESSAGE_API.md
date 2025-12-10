
Asumo que la ruta base es **`BASE_API/api/messages`** y que todas las rutas están protegidas por un *middleware* de autenticación que inyecta el ID del usuario actual en `req.user.id`. Se debe enviar un token de autenticación (ej. JWT) en el encabezado `Authorization: Bearer <token>`.

-----

## 💬 Documentación de la API de Mensajes

La ruta base para todos los *endpoints* de mensajes es `BASE_API/api/messages`.

### 1\. Enviar un Nuevo Mensaje (Crear Mensaje)

Crea un nuevo mensaje dentro de un chat existente y actualiza la información del `lastMessage` en el modelo `Chat`.

  * **Ruta:** `POST BASE_API/api/messages`
  * **Método:** `POST`
  * **Controlador:** `createMessage`
  * **Autenticación:** Requerida (obtiene `senderId` de `req.user.id`)

#### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `chatId` | *String* | **Sí** | ID del chat al que pertenece el mensaje. |
| `content` | *String* | **Sí** | Contenido (texto) del mensaje. |
| `receiverId` | *String* | **Sí** | ID del usuario que recibirá el mensaje. |

#### Ejemplo de Petición y Payload

```http
POST /api/messages HTTP/1.1
Host: BASE_API
Authorization: Bearer <token_del_remitente>
Content-Type: application/json

{
    "chatId": "65b7d6e4f3a2b1c0d9e8f7g6",
    "content": "Hola, ¿podemos coordinar la reunión para mañana?",
    "receiverId": "65b7d6e4f3a2b1c0d9e8f7a5"
}
```

#### Respuesta Exitosa (201 Created)

Devuelve el objeto del mensaje recién creado.

```json
{
    "success": true,
    "data": {
        "_id": "65b7d6e4f3a2b1c0d9e8f7z9",
        "chatId": "65b7d6e4f3a2b1c0d9e8f7g6",
        "senderId": "65b7d6e4f3a2b1c0d9e8f7b8",
        "receiverId": "65b7d6e4f3a2b1c0d9e8f7a5",
        "content": "Hola, ¿podemos coordinar la reunión para mañana?",
        "isRead": false,
        "createdAt": "2025-12-10T11:00:00.000Z",
        "updatedAt": "2025-12-10T11:00:00.000Z",
        "__v": 0
    }
}
```

#### Respuestas de Error Comunes

| Código | Mensaje | Causa |
| :--- | :--- | :--- |
| **400** | Faltan campos requeridos... | Falta `chatId`, `content`, o `receiverId` en el *payload*. |
| **404** | Chat no encontrado | El `chatId` proporcionado no existe. |
| **403** | El remitente o el destinatario... | El `senderId` o `receiverId` no son participantes del chat. |
| **500** | Error interno del servidor | Error en la base de datos o lógica del servidor. |

-----

### 2\. Obtener Mensajes por Chat

Recupera una lista paginada de mensajes de un chat específico. Los mensajes se ordenan por fecha de creación de forma descendente (más recientes primero).

  * **Ruta:** `GET BASE_API/api/messages/:chatId`
  * **Método:** `GET`
  * **Controlador:** `getMessagesByChat`
  * **Autenticación:** Requerida (verifica el permiso de acceso con `req.user.id`)

#### Parámetros de Ruta (URL Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `chatId` | *String* | **Sí** | ID del chat del que se desean obtener los mensajes. |

#### Parámetros de Consulta (Query Params)

| Nombre | Tipo | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `page` | *Number* | `1` | Número de página a recuperar. |
| `limit` | *Number* | `20` | Cantidad de mensajes por página. |

#### Ejemplo de Petición

```http
GET /api/messages/65b7d6e4f3a2b1c0d9e8f7g6?page=1&limit=10 HTTP/1.1
Host: BASE_API
Authorization: Bearer <token_del_usuario>
```

#### Respuesta Exitosa (200 OK)

Devuelve un objeto con la lista de mensajes y metadatos de paginación.

```json
{
    "success": true,
    "data": {
        "messages": [
            {
                "_id": "65b7d6e4f3a2b1c0d9e8f7z9",
                "chatId": "65b7d6e4f3a2b1c0d9e8f7g6",
                "senderId": "65b7d6e4f3a2b1c0d9e8f7b8",
                "receiverId": "65b7d6e4f3a2b1c0d9e8f7a5",
                "content": "Hola, ¿podemos coordinar la reunión para mañana?",
                "createdAt": "2025-12-10T11:00:00.000Z"
            },
            {
                "_id": "65b7d6e4f3a2b1c0d9e8f7x8",
                "chatId": "65b7d6e4f3a2b1c0d9e8f7g6",
                "senderId": "65b7d6e4f3a2b1c0d9e8f7a5",
                "receiverId": "65b7d6e4f3a2b1c0d9e8f7b8",
                "content": "Claro que sí, ¿a qué hora te funciona?",
                "createdAt": "2025-12-10T10:55:00.000Z"
            }
            // ... más mensajes (máx. 10)
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 35, // Número total de mensajes en este chat
            "pages": 4 // Total de páginas disponibles
        }
    }
}
```

#### Respuestas de Error Comunes

| Código | Mensaje | Causa |
| :--- | :--- | :--- |
| **404** | Chat no encontrado | El `chatId` proporcionado no existe. |
| **403** | No tienes permiso para ver... | El usuario autenticado no es participante de este chat. |
| **500** | Error interno del servidor | Error en la base de datos o lógica del servidor. |

-----