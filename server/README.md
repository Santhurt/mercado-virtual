# 📌 **Descripción de la aplicación**

Plataforma digital que permite a comerciantes pequeños y medianos crear, administrar y personalizar su propio catálogo de productos. Los clientes pueden explorar productos locales, interactuar con los comerciantes y realizar compras de manera sencilla.

---

# 👥 **Usuarios del sistema**

### **Clientes**

Personas interesadas en comprar productos ofrecidos por comerciantes locales.

### **Comerciantes**

Emprendedores, pequeños y medianos negocios que desean publicar sus productos y gestionar su propia tienda dentro de la plataforma.

---

# 🛍️ **Funcionalidades**

---

# 👤 **Funcionalidades para el Cliente**

### **Exploración y búsqueda**

* Visualizar un catálogo de productos organizado por categorías.
* Buscar productos mediante un buscador por texto.
* Filtrar productos por:

  * Categoría
  * Rango de precios
  * Disponibilidad
* Ver información detallada de un producto (descripción, imágenes, variantes, precio, disponibilidad, reseñas).

### **Interacción con productos**

* Agregar productos al carrito de compras.
* Seleccionar variantes disponibles (color, tamaño, modelo, etc.).
* Especificar la cantidad deseada.
* Guardar productos en una lista de deseos.
* Dejar comentarios y reseñas después de una compra.

### **Interacción con comerciantes**

* Contactar al comerciante mediante mensaje directo.
* Seguir a un comerciante para recibir actualizaciones.

### **Cuenta del cliente**

* Crear una cuenta como cliente.
* Editar y administrar información personal.
* Revisar historial de compras.
* Acceder a la lista de deseos.

---

# 🧾 **Funcionalidades para el Comerciante**

### **Cuenta del comerciante**

* Registro y creación de una cuenta de comerciante con la información requerida.
* Edición y administración de los datos del negocio.

### **Administración del catálogo**

* Crear, editar y eliminar productos.
* Subir imágenes y gestionar galerías de producto.
* Configurar variantes del producto con sus imágenes y precios.
* Controlar stock/disponibilidad por variante.

### **Interacción con consumidores**

* Responder a comentarios y reseñas.
* Gestionar mensajes directos con clientes.

### **Herramientas adicionales**

* (Opcional) Configurar un asistente de IA para responder preguntas frecuentes sobre los productos del comerciante.
* Visualizar estadísticas:

  * Ventas
  * Productos más vistos
  * Productos más vendidos
  * Seguidores
  * Interacciones de clientes

---

# ⭐ **Sugerencias de requerimientos adicionales**

Según el tipo de plataforma, te pueden faltar varios puntos importantes:

## 🔒 Seguridad y autenticación

* Recuperación de contraseña por correo.
* Verificación de correo o teléfono.
* Autenticación en dos pasos (opcional).

## 🛒 Carrito y procesos de compra

Dependiendo de si tu plataforma **vende directamente** o solo conecta clientes con comerciantes:

* Confirmación de pedido.
* Integración con pasarelas de pago (si decides agregar pagos).
* Selección de método de entrega o recogida.
* Cálculo de costos de envío (si aplica).

## 📦 Gestión para el comerciante

* Gestión de inventario.
* Gestión de pedidos (si hay compras internas).
* Configuración de políticas de devolución o garantía.

## 💬 Comunicación

* Sistema de notificaciones (siguiendo, comentarios, mensajes, productos agotados, etc.)
* Chat entre cliente y comerciante integrado en la plataforma.

## 🖼️ Personalización de la tienda del comerciante

* Personalizar colores, logo o portada de su mini-tienda.
* URL de perfil del comerciante.

## 🏪 Para la plataforma en general (administrador)

Aunque no lo mencionaste, normalmente existe un rol de **administrador**, por ejemplo:

* Moderar reseñas o comentarios.
* Ver estadísticas generales.
* Gestionar comerciantes ilegítimos o productos prohibidos.
* Aprobar nuevos comerciantes (si quieres control manual).

## 🧠 Funciones avanzadas opcionales

* Recomendaciones personalizadas según historial.
* Búsqueda inteligente o con autocompletado.
* IA que sugiere etiquetas o categorías para los productos.
* Sistema de cupones o promociones del comerciante.


---

# ✅ Gestión de usuarios (API)

Se añadió la entidad `User` para centralizar la información principal de los usuarios y permitir la autenticación vía JWT.

## 📄 Modelo de datos

Cada usuario almacena:

* `fullName`: nombre completo para identificar al usuario.
* `email`: usado para el login (único y en minúsculas).
* `password`: almacenada encriptada con bcrypt.
* `documentNumber`: número de cédula único.
* `age`, `phone`, `registrationDate`, `role`.

## 🔐 Autenticación

* `POST /api/users/register`: crea un usuario y retorna el JWT de sesión.
* `POST /api/users/login`: valida credenciales y retorna token.
* CRUD básico: `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id`.

El middleware `authMiddleware` ya valida tokens (`Bearer <token>`), pero **no está aplicado a las rutas** para facilitar el testeo. Puedes aplicarlo cuando lo necesites.

## ⚙️ Variables de entorno

Agrega las siguientes llaves al archivo `.env`:

```
JWT_SECRET=clave_super_segura
JWT_EXPIRES_IN=1d
```

Sin `JWT_SECRET`, el servidor responderá con error al intentar generar o validar tokens.

---

# 🧪 Pruebas automatizadas

Las pruebas de los endpoints se implementaron con **Jest**, **Supertest** y **mongodb-memory-server** para contar con una base de datos efímera. Ejecuta:

```
npm test
```

El comando levanta el servidor en modo test, corre los casos en `tests/*.test.js` y limpia la base en memoria después de cada caso. Asegúrate de que `JWT_SECRET` esté definido (el setup lo establece automáticamente si no existe).

