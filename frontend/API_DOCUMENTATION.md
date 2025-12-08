# API Documentation

## Users

### Register User
- **Method:** POST
- **URL:** `/api/users/register`
- **Payload:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "documentNumber": "123456789",
    "age": 30,
    "phone": "555-5555",
    "role": "customer", // optional
    "registrationDate": "2023-01-01" // optional
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Usuario creado correctamente",
    "data": {
      "user": { ... },
      "token": "jwt_token"
    }
  }
  ```

### Login User
- **Method:** POST
- **URL:** `/api/users/login`
- **Payload:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Inicio de sesión exitoso",
    "data": {
      "user": { ... },
      "token": "jwt_token"
    }
  }
  ```

### Get Profile Image
- **Method:** GET
- **URL:** `/api/users/:id/profile-image`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "profileImage": "/public/users/image.jpg"
    }
  }
  ```

### Get Users (Protected)
- **Method:** GET
- **URL:** `/api/users`
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [ ... ],
      "pagination": { ... }
    }
  }
  ```

### Get User by ID (Protected)
- **Method:** GET
- **URL:** `/api/users/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### Update User (Protected)
- **Method:** PUT
- **URL:** `/api/users/:id`
- **Payload:** (Any of the following)
  ```json
  {
    "fullName": "New Name",
    "email": "new@example.com",
    "documentNumber": "987654321",
    "age": 31,
    "phone": "555-1234",
    "role": "seller",
    "password": "newpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Usuario actualizado correctamente",
    "data": { ... }
  }
  ```

### Delete User (Protected)
- **Method:** DELETE
- **URL:** `/api/users/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Usuario eliminado correctamente"
  }
  ```

### Upload Profile Image (Protected)
- **Method:** POST
- **URL:** `/api/users/:id/profile-image`
- **Payload:** `multipart/form-data` with field `image`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Imagen de perfil actualizada correctamente",
    "data": {
      "profileImage": "/public/users/filename.jpg"
    }
  }
  ```

### Delete Profile Image (Protected)
- **Method:** DELETE
- **URL:** `/api/users/:id/profile-image`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Imagen de perfil eliminada correctamente"
  }
  ```

## Cart

### Get Cart (Protected)
- **Method:** GET
- **URL:** `/api/cart`
- **Query Params:** `userId` or `sessionId`
- **Response:**
  ```json
  {
    "_id": "...",
    "userId": "...",
    "sessionId": "...",
    "items": [],
    "status": "active"
  }
  ```

### Add to Cart (Protected)
- **Method:** POST
- **URL:** `/api/cart/add`
- **Payload:**
  ```json
  {
    "userId": "...", // or sessionId
    "productId": "...",
    "title": "Product Title",
    "price": 100,
    "quantity": 1,
    "image": "image_url"
  }
  ```
- **Response:** Updated Cart object

### Update Cart Item (Protected)
- **Method:** PUT
- **URL:** `/api/cart/update`
- **Payload:**
  ```json
  {
    "userId": "...", // or sessionId
    "productId": "...",
    "quantity": 2
  }
  ```
- **Response:** Updated Cart object

### Remove from Cart (Protected)
- **Method:** DELETE
- **URL:** `/api/cart/remove`
- **Payload:**
  ```json
  {
    "userId": "...", // or sessionId
    "productId": "..."
  }
  ```
- **Response:** Updated Cart object

### Clear Cart (Protected)
- **Method:** DELETE
- **URL:** `/api/cart/clear`
- **Payload:**
  ```json
  {
    "userId": "..." // or sessionId
  }
  ```
- **Response:** Updated Cart object

## Chats

### Get All Chats (Protected)
- **Method:** GET
- **URL:** `/api/chats`
- **Query Params:** `page`, `limit`, `userId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "chats": [ ... ],
      "pagination": { ... }
    }
  }
  ```

### Get Chat by ID (Protected)
- **Method:** GET
- **URL:** `/api/chats/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### Get Chats by User (Protected)
- **Method:** GET
- **URL:** `/api/chats/user/:userId`
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "chats": [ ... ],
      "pagination": { ... }
    }
  }
  ```

### Create Chat (Protected)
- **Method:** POST
- **URL:** `/api/chats`
- **Payload:**
  ```json
  {
    "participants": ["userId1", "userId2"],
    "lastMessage": { ... } // optional
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Chat creado exitosamente", // or "Chat ya existe"
    "data": { ... }
  }
  ```

### Update Chat (Protected)
- **Method:** PUT
- **URL:** `/api/chats/:id`
- **Payload:**
  ```json
  {
    "participants": [ ... ],
    "lastMessage": { ... }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Chat actualizado exitosamente",
    "data": { ... }
  }
  ```

### Update Last Message (Protected)
- **Method:** PATCH
- **URL:** `/api/chats/:id/last-message`
- **Payload:**
  ```json
  {
    "lastMessage": { ... }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Último mensaje actualizado exitosamente",
    "data": { ... }
  }
  ```

### Delete Chat (Protected)
- **Method:** DELETE
- **URL:** `/api/chats/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Chat eliminado exitosamente",
    "data": { ... }
  }
  ```

## Messages

### Create Message (Protected)
- **Method:** POST
- **URL:** `/api/messages`
- **Payload:**
  ```json
  {
    "chatId": "...",
    "content": "Hello world",
    "receiverId": "..."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### Get Messages by Chat (Protected)
- **Method:** GET
- **URL:** `/api/messages/:chatId`
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "messages": [ ... ],
      "pagination": { ... }
    }
  }
  ```

## Orders

### Create Order (Protected)
- **Method:** POST
- **URL:** `/api/orders`
- **Payload:**
  ```json
  {
    "customerId": "...",
    "merchantId": "...",
    "products": [ ... ],
    "subtotal": 100,
    "total": 100,
    "shippingAddress": { ... },
    // ... other order fields
  }
  ```
- **Response:** Created Order object

### Get Order by ID (Protected)
- **Method:** GET
- **URL:** `/api/orders/:id`
- **Response:** Order object

### Get Orders by User (Protected)
- **Method:** GET
- **URL:** `/api/orders/user/:userId`
- **Response:** Array of Order objects

### Update Order Status (Protected)
- **Method:** PATCH
- **URL:** `/api/orders/:id/status`
- **Payload:**
  ```json
  {
    "status": "shipped",
    "actorId": "..." // optional
  }
  ```
- **Response:** Updated Order object

## Products

### Get All Products
- **Method:** GET
- **URL:** `/api/products`
- **Query Params:** `page`, `limit`, `status`, `minPrice`, `maxPrice`, `sellerId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "products": [ ... ],
      "pagination": { ... }
    }
  }
  ```

### Get Product by ID
- **Method:** GET
- **URL:** `/api/products/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### Create Product (Protected)
- **Method:** POST
- **URL:** `/api/products`
- **Payload:**
  ```json
  {
    "sellerId": "...",
    "title": "Product Name",
    "price": 100,
    "status": "active",
    "rating": 5,
    "description": "...",
    "stock": 10,
    "features": [],
    "tags": [],
    "specifications": {}
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Producto creado exitosamente",
    "data": { ... }
  }
  ```

### Update Product (Protected)
- **Method:** PUT
- **URL:** `/api/products/:id`
- **Payload:** (Any product field except sellerId)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Producto actualizado exitosamente",
    "data": { ... }
  }
  ```

### Delete Product (Protected)
- **Method:** DELETE
- **URL:** `/api/products/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Producto eliminado exitosamente",
    "data": { ... }
  }
  ```

### Upload Product Images (Protected)
- **Method:** POST
- **URL:** `/api/products/:id/images`
- **Payload:** `multipart/form-data` with field `images` (max 5)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Imágenes añadidas correctamente",
    "data": [ "path/to/image1", ... ]
  }
  ```

### Remove Product Image (Protected)
- **Method:** DELETE
- **URL:** `/api/products/:id/images`
- **Payload:**
  ```json
  {
    "imagePath": "path/to/image"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Imagen eliminada correctamente",
    "data": [ ... ] // remaining images
  }
  ```

## Sellers

### Create Seller (Protected)
- **Method:** POST
- **URL:** `/api/sellers`
- **Payload:**
  ```json
  {
    "userId": "...",
    "businessName": "My Shop",
    "description": "...",
    "accountStatus": "active" // optional
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Comerciante creado correctamente",
    "data": { ... }
  }
  ```

### Get Sellers (Protected)
- **Method:** GET
- **URL:** `/api/sellers`
- **Query Params:** `page`, `limit`, `accountStatus`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "sellers": [ ... ],
      "pagination": { ... }
    }
  }
  ```

### Get Seller by ID (Protected)
- **Method:** GET
- **URL:** `/api/sellers/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### Update Seller (Protected)
- **Method:** PUT
- **URL:** `/api/sellers/:id`
- **Payload:**
  ```json
  {
    "businessName": "...",
    "description": "...",
    "accountStatus": "..."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Comerciante actualizado correctamente",
    "data": { ... }
  }
  ```

### Delete Seller (Protected)
- **Method:** DELETE
- **URL:** `/api/sellers/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Comerciante eliminado correctamente"
  }
  ```
