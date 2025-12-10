
La ruta base para todos los *endpoints* del chat es **`BASE_API/api/chats`**. Se asume que todas las rutas requieren autenticación (`authMiddleware`) mediante un token enviado en el encabezado `Authorization: Bearer <token>`.

-----

## 👥 Documentación de la API de Chats

La clave de estos *endpoints* es que el campo `participants` siempre está "poblado" (`.populate`), lo que significa que en lugar de solo ver el ID del usuario, verás el objeto completo del usuario (excepto la contraseña).

### 1\. Obtener Todos los Chats (Paginado y Filtrado Opcional)

Permite obtener una lista paginada de todos los chats. Puede ser filtrada opcionalmente para obtener solo los chats donde un `userId` específico es participante.

  * **Ruta:** `GET BASE_API/api/chats`
  * **Método:** `GET`
  * **Controlador:** `getAllChats`
  * **Autenticación:** Requerida

#### Parámetros de Consulta (Query Params)

| Nombre | Tipo | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `page` | *Number* | `1` | Número de página a recuperar. |
| `limit` | *Number* | `10` | Cantidad de chats por página. |
| `userId` | *String* | *Ninguno* | **Opcional**. Filtra para mostrar solo chats donde este ID es un participante. |

#### Ejemplo de Petición

```http
GET /api/chats?userId=65b7d6e4f3a2b1c0d9e8f7b8&limit=5 HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200 OK)

Devuelve una lista paginada de objetos de chat, con los participantes poblados.

```json
{
    "success": true,
    "data": {
        "chats": [
            {
                "_id": "65b7d6e4f3a2b1c0d9e8f7g6",
                "participants": [
                    {
                        "_id": "65b7d6e4f3a2b1c0d9e8f7b8",
                        "username": "usuario_a",
                        "email": "a@example.com"
                        // Otros campos de usuario excepto password
                    },
                    {
                        "_id": "65b7d6e4f3a2b1c0d9e8f7a5",
                        "username": "usuario_b",
                        "email": "b@example.com"
                    }
                ],
                "lastMessage": {
                    "text": "Hola, ¿podemos coordinar?",
                    "sender": "65b7d6e4f3a2b1c0d9e8f7b8",
                    "timestamp": "2025-12-10T11:00:00.000Z"
                },
                "createdAt": "2025-12-01T09:00:00.000Z",
                "updatedAt": "2025-12-10T11:00:00.000Z"
            }
            // ... otros chats
        ],
        "pagination": {
            "page": 1,
            "limit": 5,
            "total": 12,
            "pages": 3
        }
    }
}
```

-----

### 2\. Obtener Chats de un Usuario Específico

Obtiene una lista paginada de todos los chats donde un usuario específico es participante. Es esencialmente el mismo que `getAllChats` pero usando un parámetro de ruta para el ID del usuario y con validación de existencia del usuario.

  * **Ruta:** `GET BASE_API/api/chats/user/:userId`
  * **Método:** `GET`
  * **Controlador:** `getChatsByUser`
  * **Autenticación:** Requerida

#### Parámetros de Ruta (URL Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `userId` | *String* | **Sí** | ID del usuario cuyos chats se desean obtener. |

#### Parámetros de Consulta (Query Params)

| Nombre | Tipo | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `page` | *Number* | `1` | Número de página. |
| `limit` | *Number* | `10` | Cantidad de chats por página. |

#### Ejemplo de Petición

```http
GET /api/chats/user/65b7d6e4f3a2b1c0d9e8f7b8?page=1 HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200 OK)

(Formato idéntico a `getAllChats`, pero filtrado por el `userId` en la ruta).

-----

### 3\. Obtener Chat por ID

Obtiene los detalles de un chat específico por su ID, incluyendo los participantes poblados.

  * **Ruta:** `GET BASE_API/api/chats/:id`
  * **Método:** `GET`
  * **Controlador:** `getChatById`
  * **Autenticación:** Requerida

#### Parámetros de Ruta (URL Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | *String* | **Sí** | ID del chat. |

#### Ejemplo de Petición

```http
GET /api/chats/65b7d6e4f3a2b1c0d9e8f7g6 HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200 OK)

Devuelve el objeto del chat encontrado.

```json
{
    "success": true,
    "data": {
        "_id": "65b7d6e4f3a2b1c0d9e8f7g6",
        "participants": [
            // ... objetos de usuario poblados ...
        ],
        "lastMessage": {
            "text": "Hola, ¿podemos coordinar?",
            "sender": "65b7d6e4f3a2b1c0d9e8f7b8",
            "timestamp": "2025-12-10T11:00:00.000Z"
        },
        "createdAt": "2025-12-01T09:00:00.000Z",
        "updatedAt": "2025-12-10T11:00:00.000Z",
        "__v": 1
    }
}
```

-----

### 4\. Crear un Nuevo Chat

Crea un nuevo chat con la lista de participantes proporcionada. Si ya existe un chat con exactamente esos participantes, devuelve el chat existente con un código 200.

  * **Ruta:** `POST BASE_API/api/chats`
  * **Método:** `POST`
  * **Controlador:** `createChat`
  * **Autenticación:** Requerida

#### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `participants` | *Array de String* | **Sí** | Lista de IDs de los usuarios que participarán en el chat (mínimo 2). |
| `lastMessage` | *Object* | Opcional | Objeto inicial del último mensaje (ej. para chats importados). |

#### Ejemplo de Petición y Payload

```http
POST /api/chats HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
Content-Type: application/json

{
    "participants": [
        "65b7d6e4f3a2b1c0d9e8f7b8", 
        "65b7d6e4f3a2b1c0d9e8f7a5"
    ]
}
```

#### Respuesta Exitosa (201 Created o 200 OK si ya existe)

Devuelve el objeto del chat, con los participantes poblados.

```json
{
    "success": true,
    "message": "Chat creado exitosamente",
    "data": {
        "_id": "65c1f5e8a3d4c5b6e7f8g9h0",
        "participants": [
            // ... objetos de usuario poblados ...
        ],
        "lastMessage": null,
        "createdAt": "2025-12-10T11:30:00.000Z",
        "updatedAt": "2025-12-10T11:30:00.000Z"
    }
}
```

#### Respuestas de Error Comunes

| Código | Mensaje | Causa |
| :--- | :--- | :--- |
| **400** | El campo 'participants' es requerido... | El campo no está presente o no es un array. |
| **400** | Un chat debe tener al menos 2 participantes | El array de `participants` tiene menos de dos IDs. |
| **404** | Uno o más participantes no existen | Alguno de los IDs de usuario en `participants` no es válido. |

-----

### 5\. Actualizar Chat (Participantes / Último Mensaje)

Actualiza los campos de un chat por su ID. Actualmente permite cambiar la lista completa de participantes y/o el objeto `lastMessage`.

  * **Ruta:** `PUT BASE_API/api/chats/:id`
  * **Método:** `PUT`
  * **Controlador:** `updateChat`
  * **Autenticación:** Requerida

#### Parámetros de Ruta (URL Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | *String* | **Sí** | ID del chat a actualizar. |

#### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `participants` | *Array de String* | Opcional | La nueva lista completa de IDs de participantes (mínimo 2). |
| `lastMessage` | *Object* | Opcional | El nuevo objeto `lastMessage`. |

#### Ejemplo de Petición y Payload (Añadir un participante)

```http
PUT /api/chats/65b7d6e4f3a2b1c0d9e8f7g6 HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
Content-Type: application/json

{
    "participants": [
        "65b7d6e4f3a2b1c0d9e8f7b8", 
        "65b7d6e4f3a2b1c0d9e8f7a5", 
        "65b7d6e4f3a2b1c0d9e8f7c9" // Nuevo participante
    ]
}
```

#### Respuesta Exitosa (200 OK)

Devuelve el objeto del chat actualizado.

-----

### 6\. Actualizar Solo el Último Mensaje

Actualiza solo el campo `lastMessage` de un chat específico. Útil para optimizar cuando solo se envía un nuevo mensaje y el resto del chat no ha cambiado.

  * **Ruta:** `PATCH BASE_API/api/chats/:id/last-message`
  * **Método:** `PATCH`
  * **Controlador:** `updateLastMessage`
  * **Autenticación:** Requerida

#### Parámetros de Ruta (URL Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | *String* | **Sí** | ID del chat a actualizar. |

#### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `lastMessage` | *Object* | **Sí** | El nuevo objeto `lastMessage`. |

#### Ejemplo de Petición y Payload

```http
PATCH /api/chats/65b7d6e4f3a2b1c0d9e8f7g6/last-message HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
Content-Type: application/json

{
    "lastMessage": {
        "text": "¡Mensaje enviado exitosamente!",
        "sender": "65b7d6e4f3a2b1c0d9e8f7b8",
        "timestamp": "2025-12-10T11:45:00.000Z"
    }
}
```

#### Respuesta Exitosa (200 OK)

Devuelve el objeto del chat con el `lastMessage` actualizado.

-----

### 7\. Eliminar un Chat

Elimina permanentemente un chat por su ID.

  * **Ruta:** `DELETE BASE_API/api/chats/:id`
  * **Método:** `DELETE`
  * **Controlador:** `deleteChat`
  * **Autenticación:** Requerida

#### Parámetros de Ruta (URL Params)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | *String* | **Sí** | ID del chat a eliminar. |

#### Ejemplo de Petición

```http
DELETE /api/chats/65b7d6e4f3a2b1c0d9e8f7g6 HTTP/1.1
Host: BASE_API
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200 OK)

Devuelve el objeto del chat eliminado.

```json
{
    "success": true,
    "message": "Chat eliminado exitosamente",
    "data": {
        // ... objeto del chat eliminado ...
    }
}
```

-----
