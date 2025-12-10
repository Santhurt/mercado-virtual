# Documentación de la API de Órdenes

La ruta base para todos los endpoints de órdenes es `API_URL/orders`.

**Nota:** Todos los endpoints requieren autenticación mediante el `authMiddleware`. Se debe incluir un token Bearer válido en el encabezado `Authorization`.

---

## Índice de Endpoints

1. [Crear Orden](#1-crear-orden) - `POST /orders`
2. [Obtener Orden por ID](#2-obtener-orden-por-id) - `GET /orders/:id`
3. [Obtener Órdenes por Usuario](#3-obtener-órdenes-por-usuario) - `GET /orders/user/:userId`
4. [Obtener Órdenes por Vendedor](#4-obtener-órdenes-por-vendedor) - `GET /orders/seller/:sellerId`
5. [Actualizar Estado de la Orden](#5-actualizar-estado-de-la-orden) - `PATCH /orders/:id/status`

---

## 1. Crear Orden

Crea una nueva orden en el sistema con validación de vendedores asignados. Automáticamente se registra un historial inicial con el estado de la orden.

**Ruta:** `POST API_URL/orders`

**Método:** POST

**Autenticación:** Requerida

### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| customerId | String | Sí | ID del cliente que realiza la orden. |
| products | Array | Sí | Lista de productos en la orden. |
| products[].productId | String | Sí | ID del producto. |
| products[].seller | String | Sí | ID del vendedor del producto (obligatorio). |
| products[].quantity | Number | Sí | Cantidad del producto. |
| products[].price | Number | Sí | Precio unitario del producto. |
| products[].subtotal | Number | Sí | Subtotal (precio × cantidad). |
| totalAmount | Number | Sí | Monto total de la orden. |
| shippingAddress | Object | Sí | Dirección de envío completa. |
| paymentMethod | String | Sí | Método de pago utilizado. |
| status | String | Opcional | Estado inicial (por defecto: 'pending'). |

### Ejemplo de Petición

```http
POST /orders HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
Content-Type: application/json

{
    "customerId": "60d5ec49c6f2e80015b6d5f7",
    "products": [
        {
            "productId": "70d6a2f3a4b5c6d7e8f9a0b1",
            "seller": "80d7b3f4a5c6d7e8f9a0b1c2",
            "quantity": 2,
            "price": 25.50,
            "subtotal": 51.00
        },
        {
            "productId": "90e7f4g5h6i7j8k9l0m1n2o3",
            "seller": "90e8c4f5a6c7d8e9f0a1b2c3",
            "quantity": 1,
            "price": 59.99,
            "subtotal": 59.99
        }
    ],
    "totalAmount": 110.99,
    "shippingAddress": {
        "street": "Calle Principal 123",
        "city": "Pereira",
        "state": "Risaralda",
        "zipCode": "660001",
        "country": "Colombia"
    },
    "paymentMethod": "credit_card",
    "status": "pending"
}
```

### Respuesta Exitosa (201 Created)

```json
{
    "_id": "60d5ec49c6f2e80015b6d7a1",
    "customerId": {
        "_id": "60d5ec49c6f2e80015b6d5f7",
        "fullName": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+57 300 1234567"
    },
    "products": [
        {
            "_id": "60d5ec49c6f2e80015b6d7a2",
            "productId": {
                "_id": "70d6a2f3a4b5c6d7e8f9a0b1",
                "title": "T-shirt Cool",
                "price": 25.50,
                "images": ["https://example.com/tshirt.jpg"]
            },
            "seller": {
                "_id": "80d7b3f4a5c6d7e8f9a0b1c2",
                "businessName": "Fashion Store",
                "userId": "60d5ec49c6f2e80015b6d5f8"
            },
            "quantity": 2,
            "price": 25.50,
            "subtotal": 51.00
        },
        {
            "_id": "60d5ec49c6f2e80015b6d7a3",
            "productId": {
                "_id": "90e7f4g5h6i7j8k9l0m1n2o3",
                "title": "Jeans Slim Fit",
                "price": 59.99,
                "images": ["https://example.com/jeans.jpg"]
            },
            "seller": {
                "_id": "90e8c4f5a6c7d8e9f0a1b2c3",
                "businessName": "Denim Shop",
                "userId": "60d5ec49c6f2e80015b6d5f9"
            },
            "quantity": 1,
            "price": 59.99,
            "subtotal": 59.99
        }
    ],
    "totalAmount": 110.99,
    "shippingAddress": {
        "street": "Calle Principal 123",
        "city": "Pereira",
        "state": "Risaralda",
        "zipCode": "660001",
        "country": "Colombia"
    },
    "paymentMethod": "credit_card",
    "status": "pending",
    "history": [
        {
            "status": "pending",
            "timestamp": "2021-06-25T10:00:00.000Z",
            "actorId": "60d5ec49c6f2e80015b6d5f7",
            "_id": "60d5ec49c6f2e80015b6d7a4"
        }
    ],
    "createdAt": "2021-06-25T10:00:00.000Z",
    "updatedAt": "2021-06-25T10:00:00.000Z",
    "__v": 0
}
```

### Respuestas de Error

**400 Bad Request** - Productos sin vendedor asignado:

```json
{
    "message": "All products must have a seller assigned"
}
```

**500 Internal Server Error**:

```json
{
    "message": "Error message details"
}
```

---

## 2. Obtener Orden por ID

Recupera los detalles completos de una orden específica con toda la información populada.

**Ruta:** `GET API_URL/orders/:id`

**Método:** GET

**Autenticación:** Requerida

### Parámetros de Ruta

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| id | String | Sí | ID de la orden a consultar. |

### Ejemplo de Petición

```http
GET /orders/60d5ec49c6f2e80015b6d7a1 HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
```

### Respuesta Exitosa (200 OK)

```json
{
    "_id": "60d5ec49c6f2e80015b6d7a1",
    "customerId": {
        "_id": "60d5ec49c6f2e80015b6d5f7",
        "fullName": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+57 300 1234567"
    },
    "products": [
        {
            "_id": "60d5ec49c6f2e80015b6d7a2",
            "productId": {
                "_id": "70d6a2f3a4b5c6d7e8f9a0b1",
                "title": "T-shirt Cool",
                "price": 25.50,
                "images": ["https://example.com/tshirt.jpg"]
            },
            "seller": {
                "_id": "80d7b3f4a5c6d7e8f9a0b1c2",
                "businessName": "Fashion Store",
                "userId": "60d5ec49c6f2e80015b6d5f8"
            },
            "quantity": 2,
            "price": 25.50,
            "subtotal": 51.00
        }
    ],
    "totalAmount": 110.99,
    "shippingAddress": {
        "street": "Calle Principal 123",
        "city": "Pereira",
        "state": "Risaralda",
        "zipCode": "660001",
        "country": "Colombia"
    },
    "paymentMethod": "credit_card",
    "status": "pending",
    "history": [
        {
            "status": "pending",
            "timestamp": "2021-06-25T10:00:00.000Z",
            "actorId": "60d5ec49c6f2e80015b6d5f7",
            "_id": "60d5ec49c6f2e80015b6d7a4"
        }
    ],
    "createdAt": "2021-06-25T10:00:00.000Z",
    "updatedAt": "2021-06-25T10:00:00.000Z",
    "__v": 0
}
```

### Respuestas de Error

**404 Not Found**:

```json
{
    "message": "Order not found"
}
```

**500 Internal Server Error**:

```json
{
    "message": "Error message details"
}
```

---

## 3. Obtener Órdenes por Usuario

Recupera todas las órdenes de un cliente específico, ordenadas de más reciente a más antigua.

**Ruta:** `GET API_URL/orders/user/:userId`

**Método:** GET

**Autenticación:** Requerida

### Parámetros de Ruta

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| userId | String | Sí | ID del usuario/cliente cuyas órdenes se consultan. |

### Ejemplo de Petición

```http
GET /orders/user/60d5ec49c6f2e80015b6d5f7 HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
```

### Respuesta Exitosa (200 OK)

Devuelve un array de órdenes ordenadas por `createdAt` descendente (más recientes primero).

```json
[
    {
        "_id": "60d5ec49c6f2e80015b6d7a2",
        "customerId": {
            "_id": "60d5ec49c6f2e80015b6d5f7",
            "fullName": "Juan Pérez",
            "email": "juan@example.com",
            "phone": "+57 300 1234567"
        },
        "products": [
            {
                "_id": "60d5ec49c6f2e80015b6d7a5",
                "productId": {
                    "_id": "90e7f4g5h6i7j8k9l0m1n2o3",
                    "title": "Jeans Slim Fit",
                    "price": 59.99,
                    "images": ["https://example.com/jeans.jpg"]
                },
                "seller": {
                    "_id": "90e8c4f5a6c7d8e9f0a1b2c3",
                    "businessName": "Denim Shop",
                    "userId": "60d5ec49c6f2e80015b6d5f9"
                },
                "quantity": 1,
                "price": 59.99,
                "subtotal": 59.99
            }
        ],
        "totalAmount": 59.99,
        "status": "delivered",
        "history": [
            {
                "status": "pending",
                "timestamp": "2021-06-26T10:00:00.000Z",
                "actorId": "60d5ec49c6f2e80015b6d5f7",
                "_id": "60d5ec49c6f2e80015b6d7a6"
            },
            {
                "status": "delivered",
                "timestamp": "2021-06-27T15:00:00.000Z",
                "actorId": "system",
                "_id": "60d5ec49c6f2e80015b6d7a7"
            }
        ],
        "createdAt": "2021-06-26T10:00:00.000Z",
        "updatedAt": "2021-06-27T15:00:00.000Z"
    },
    {
        "_id": "60d5ec49c6f2e80015b6d7a1",
        "customerId": {
            "_id": "60d5ec49c6f2e80015b6d5f7",
            "fullName": "Juan Pérez",
            "email": "juan@example.com",
            "phone": "+57 300 1234567"
        },
        "products": [
            {
                "_id": "60d5ec49c6f2e80015b6d7a2",
                "productId": {
                    "_id": "70d6a2f3a4b5c6d7e8f9a0b1",
                    "title": "T-shirt Cool",
                    "price": 25.50,
                    "images": ["https://example.com/tshirt.jpg"]
                },
                "seller": {
                    "_id": "80d7b3f4a5c6d7e8f9a0b1c2",
                    "businessName": "Fashion Store",
                    "userId": "60d5ec49c6f2e80015b6d5f8"
                },
                "quantity": 2,
                "price": 25.50,
                "subtotal": 51.00
            }
        ],
        "totalAmount": 51.00,
        "status": "pending",
        "createdAt": "2021-06-25T10:00:00.000Z",
        "updatedAt": "2021-06-25T10:00:00.000Z"
    }
]
```

### Respuestas de Error

**500 Internal Server Error**:

```json
{
    "message": "Error message details"
}
```

---

## 4. Obtener Órdenes por Vendedor

Recupera todas las órdenes que contienen productos de un vendedor específico. Filtra cada orden para mostrar únicamente los productos de ese vendedor y calcula un subtotal específico.

**Ruta:** `GET API_URL/orders/seller/:sellerId`

**Método:** GET

**Autenticación:** Requerida

### Parámetros de Ruta

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| sellerId | String | Sí | ID del vendedor cuyas ventas se consultan. |

### Ejemplo de Petición

```http
GET /orders/seller/80d7b3f4a5c6d7e8f9a0b1c2 HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
```

### Respuesta Exitosa (200 OK)

Devuelve un array de órdenes filtradas. Cada orden contiene:
- Solo los productos del vendedor especificado
- Campo adicional `sellerSubtotal`: suma de los subtotales de productos del vendedor
- El campo `totalAmount` mantiene el total original de la orden completa

```json
[
    {
        "_id": "60d5ec49c6f2e80015b6d7a1",
        "customerId": {
            "_id": "60d5ec49c6f2e80015b6d5f7",
            "fullName": "Juan Pérez",
            "email": "juan@example.com",
            "phone": "+57 300 1234567"
        },
        "products": [
            {
                "_id": "60d5ec49c6f2e80015b6d7a2",
                "productId": {
                    "_id": "70d6a2f3a4b5c6d7e8f9a0b1",
                    "title": "T-shirt Cool",
                    "price": 25.50,
                    "images": ["https://example.com/tshirt.jpg"]
                },
                "seller": {
                    "_id": "80d7b3f4a5c6d7e8f9a0b1c2",
                    "businessName": "Fashion Store",
                    "userId": "60d5ec49c6f2e80015b6d5f8"
                },
                "quantity": 2,
                "price": 25.50,
                "subtotal": 51.00
            }
        ],
        "sellerSubtotal": 51.00,
        "totalAmount": 110.99,
        "shippingAddress": {
            "street": "Calle Principal 123",
            "city": "Pereira",
            "state": "Risaralda",
            "zipCode": "660001",
            "country": "Colombia"
        },
        "paymentMethod": "credit_card",
        "status": "pending",
        "history": [
            {
                "status": "pending",
                "timestamp": "2021-06-25T10:00:00.000Z",
                "actorId": "60d5ec49c6f2e80015b6d5f7",
                "_id": "60d5ec49c6f2e80015b6d7a4"
            }
        ],
        "createdAt": "2021-06-25T10:00:00.000Z",
        "updatedAt": "2021-06-25T10:00:00.000Z",
        "__v": 0
    }
]
```

**Nota importante:** 
- `sellerSubtotal`: Total de ventas del vendedor específico en esa orden
- `totalAmount`: Total general de toda la orden (puede incluir productos de otros vendedores)

### Respuestas de Error

**500 Internal Server Error**:

```json
{
    "message": "Error message details"
}
```

---

## 5. Actualizar Estado de la Orden

Actualiza el estado de una orden y registra el cambio en el historial con timestamp y actor.

**Ruta:** `PATCH API_URL/orders/:id/status`

**Método:** PATCH

**Autenticación:** Requerida

### Parámetros de Ruta

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| id | String | Sí | ID de la orden a actualizar. |

### Payload (Cuerpo de la Petición)

| Nombre | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| status | String | Sí | Nuevo estado. Valores válidos: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'. |
| actorId | String | Opcional | ID del usuario que realiza el cambio. Por defecto: 'system'. |

### Ejemplo de Petición

```http
PATCH /orders/60d5ec49c6f2e80015b6d7a1/status HTTP/1.1
Host: API_URL
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "shipped",
    "actorId": "60d5ec49c6f2e80015b6d5f8"
}
```

### Respuesta Exitosa (200 OK)

```json
{
    "_id": "60d5ec49c6f2e80015b6d7a1",
    "customerId": {
        "_id": "60d5ec49c6f2e80015b6d5f7",
        "fullName": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+57 300 1234567"
    },
    "products": [
        {
            "_id": "60d5ec49c6f2e80015b6d7a2",
            "productId": {
                "_id": "70d6a2f3a4b5c6d7e8f9a0b1",
                "title": "T-shirt Cool",
                "price": 25.50,
                "images": ["https://example.com/tshirt.jpg"]
            },
            "seller": {
                "_id": "80d7b3f4a5c6d7e8f9a0b1c2",
                "businessName": "Fashion Store",
                "userId": "60d5ec49c6f2e80015b6d5f8"
            },
            "quantity": 2,
            "price": 25.50,
            "subtotal": 51.00
        }
    ],
    "totalAmount": 110.99,
    "shippingAddress": {
        "street": "Calle Principal 123",
        "city": "Pereira",
        "state": "Risaralda",
        "zipCode": "660001",
        "country": "Colombia"
    },
    "paymentMethod": "credit_card",
    "status": "shipped",
    "history": [
        {
            "status": "pending",
            "timestamp": "2021-06-25T10:00:00.000Z",
            "actorId": "60d5ec49c6f2e80015b6d5f7",
            "_id": "60d5ec49c6f2e80015b6d7a4"
        },
        {
            "status": "shipped",
            "timestamp": "2021-06-26T14:30:00.000Z",
            "actorId": "60d5ec49c6f2e80015b6d5f8",
            "_id": "60d5ec49c6f2e80015b6d7a8"
        }
    ],
    "createdAt": "2021-06-25T10:00:00.000Z",
    "updatedAt": "2021-06-26T14:30:00.000Z",
    "__v": 0
}
```

### Respuestas de Error

**400 Bad Request** - Estado inválido:

```json
{
    "message": "Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled"
}
```

**404 Not Found** - Orden no encontrada:

```json
{
    "message": "Order not found"
}
```

**500 Internal Server Error**:

```json
{
    "message": "Error message details"
}
```

---

## Estados de Orden Válidos

| Estado | Descripción |
| :--- | :--- |
| pending | Orden creada, pendiente de procesamiento |
| processing | Orden en proceso de preparación |
| shipped | Orden enviada al cliente |
| delivered | Orden entregada exitosamente |
| cancelled | Orden cancelada |

---

## Estructura de Referencias Populadas

### Customer (customerId)
```json
{
    "_id": "String",
    "fullName": "String",
    "email": "String",
    "phone": "String"
}
```

### Product (productId)
```json
{
    "_id": "String",
    "title": "String",
    "price": "Number",
    "images": ["Array de URLs"]
}
```

### Seller (seller)
```json
{
    "_id": "String",
    "businessName": "String",
    "userId": "String"
}
```

---

## Estructura del Historial (history)

Cada cambio de estado se registra en el array `history`:

```json
{
    "status": "String",
    "timestamp": "Date (ISO 8601)",
    "actorId": "String (userId o 'system')",
    "_id": "String (MongoDB ObjectId)"
}
```

---

## Códigos de Respuesta HTTP

| Código | Descripción |
| :--- | :--- |
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Solicitud incorrecta (validación fallida) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Notas Importantes

1. **Validación de vendedores**: Todos los productos en una orden deben tener un vendedor asignado
2. **Referencias populadas**: Todas las respuestas incluyen información completa de clientes, productos y vendedores
3. **Historial automático**: Cada cambio de estado se registra automáticamente con timestamp y actor
4. **Ordenamiento**: Las consultas por usuario y vendedor ordenan por fecha de creación descendente
5. **Filtrado por vendedor**: El endpoint de vendedor filtra productos y calcula subtotales específicos