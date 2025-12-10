````markdown
# 💬 Guía de Integración Frontend - WebSocket Chat

**Guía completa para implementar el cliente Socket.io en React y conectar con el servidor de chat en tiempo real.**

---

## 1. Instalación

Instala el cliente de `socket.io` en tu proyecto frontend:

```bash
npm install socket.io-client
````

## 2\. Configuración del Cliente Socket.io

### Crear Hook Personalizado `useSocket.js`

Crea el archivo `src/hooks/useSocket.js`. Este *hook* manejará la conexión, la autenticación y los estados básicos de conexión/error.

```javascript
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

export const useSocket = (token) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    // Crear conexión con autenticación (Bearer Token)
    socketRef.current = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('✅ Socket conectado:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Error de conexión:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado:', reason);
      setIsConnected(false);
    });

    // Cleanup: desconectar al desmontar
    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { socket: socketRef.current, isConnected, error };
};
```

## 3\. Context Provider para Chat

### Crear `ChatContext.jsx`

Crea el archivo `src/contexts/ChatContext.jsx`. Este contexto centralizará la lógica de escucha de eventos, el manejo de mensajes y las funciones de emisión.

```javascript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from './AuthContext'; // Importa tu contexto de autenticación

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token } = useAuth(); // Obtener token del contexto de auth
  const { socket, isConnected, error } = useSocket(token);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!socket) return;

    // --- Eventos que ESCUCHAS (Servidor → Cliente) ---

    // Nuevo mensaje
    socket.on('new_message', (message) => {
      setMessages((prev) => ({
        ...prev,
        [message.chatId]: [...(prev[message.chatId] || []), message],
      }));
    });

    // Confirmación de entrega
    socket.on('message_delivered', ({ messageId, status }) => {
      console.log(`Mensaje ${messageId} entregado:`, status);
      // Lógica opcional para actualizar el estado del mensaje
    });

    // Usuarios escribiendo
    socket.on('user_typing', ({ chatId, userId, userName, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: isTyping ? { userId, userName } : null,
      }));
    });

    // Mensajes marcados como vistos
    socket.on('messages_marked_seen', ({ chatId, messageIds }) => {
      setMessages((prev) => ({
        ...prev,
        [chatId]: prev[chatId]?.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, status: 'seen' } : msg
        ),
      }));
    });

    // Errores de socket
    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    return () => {
      socket.off('new_message');
      socket.off('message_delivered');
      socket.off('user_typing');
      socket.off('messages_marked_seen');
      socket.off('error');
    };
  }, [socket]);

  // --- Funciones que EMITES (Cliente → Servidor) ---

  const joinChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('join_chat', { chatId });
      setActiveChat(chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', { chatId });
      if (activeChat === chatId) setActiveChat(null);
    }
  };

  const sendMessage = (chatId, receiverId, content) => {
    if (socket && isConnected) {
      socket.emit('send_message', { chatId, receiverId, content });
    }
  };

  const setTyping = (chatId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, isTyping });
    }
  };

  const markAsSeen = (chatId, messageIds) => {
    if (socket && isConnected) {
      socket.emit('message_seen', { chatId, messageIds });
    }
  };

  const value = {
    socket,
    isConnected,
    error,
    messages,
    activeChat,
    typingUsers,
    joinChat,
    leaveChat,
    sendMessage,
    setTyping,
    markAsSeen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};
```

## 4\. Componente de Chat

### Ejemplo de `ChatWindow.jsx`

Este componente consume el contexto para unirse a un chat, mostrar mensajes, manejar la escritura y el envío.

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';

export const ChatWindow = ({ chatId, receiverId }) => {
  const { messages, sendMessage, setTyping, markAsSeen, typingUsers, joinChat, leaveChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const chatMessages = messages[chatId] || [];
  // NOTA: Reemplazar 'YOUR_USER_ID' con el ID real del usuario autenticado
  const YOUR_USER_ID = 'YOUR_USER_ID'; 

  useEffect(() => {
    // 1. Unirse al chat al montar
    joinChat(chatId);

    // 2. Abandonar al desmontar
    return () => leaveChat(chatId);
  }, [chatId]); // Dependencia clave: solo se ejecuta al cambiar el ID del chat

  useEffect(() => {
    // Scroll al final cuando hay nuevos mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Marcar mensajes como vistos
    const unreadIds = chatMessages
      .filter((msg) => msg.receiverId === YOUR_USER_ID && msg.status !== 'seen')
      .map((msg) => msg._id);

    if (unreadIds.length > 0) {
      markAsSeen(chatId, unreadIds);
    }
  }, [chatMessages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    // Indicar que está escribiendo
    setTyping(chatId, true);

    // Cancelar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Dejar de escribir después de 2 segundos de inactividad
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(chatId, false);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(chatId, receiverId, inputValue.trim());
    setInputValue('');
    setTyping(chatId, false); // Detener indicador de escritura después de enviar
  };

  return (
    <div className="chat-window">
      {/* Lista de mensajes */}
      <div className="messages-container">
        {chatMessages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderId._id === YOUR_USER_ID ? 'sent' : 'received'}`}
          >
            <p>{msg.content}</p>
            <span className="timestamp">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
            {msg.senderId._id === YOUR_USER_ID && (
              <span className="status">{msg.status}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Indicador de escritura */}
      {typingUsers[chatId] && typingUsers[chatId].userId !== YOUR_USER_ID && (
        <div className="typing-indicator">
          {typingUsers[chatId].userName} está escribiendo...
        </div>
      )}

      {/* Input de mensaje */}
      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Escribe un mensaje..."
          disabled={!messagesEndRef.current} // Deshabilitar si no se ha unido al chat
        />
        <button type="submit" disabled={!inputValue.trim()}>Enviar</button>
      </form>
    </div>
  );
};
```

## 5\. Integración en `App.jsx`

Envuelve tu aplicación con los **Context Providers** de Autenticación y Chat:

```javascript
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider } from './contexts/AuthContext'; // Asegúrate de tener este

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        {/* Tus rutas, componentes y la ventana de chat aquí */}
      </ChatProvider>
    </AuthProvider>
  );
}
```

## 6\. API de Eventos Completa

### Eventos que EMITES (Cliente → Servidor)

| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `join_chat` | `{ chatId: string }` | Unirse a una sala de chat |
| `leave_chat` | `{ chatId: string }` | Salir de una sala de chat |
| `send_message` | `{ chatId: string, receiverId: string, content: string }` | Enviar mensaje |
| `typing` | `{ chatId: string, isTyping: boolean }` | Indicar estado de escritura |
| `message_seen` | `{ chatId: string, messageIds: string[] }` | Marcar mensajes como vistos |

### Eventos que ESCUCHAS (Servidor → Cliente)

| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `new_message` | `Message object` | Nuevo mensaje recibido |
| `message_delivered` | `{ messageId: string, status: string }` | Confirmación de entrega |
| `user_typing` | `{ chatId: string, userId: string, userName: string, isTyping: boolean }` | Usuario escribiendo |
| `messages_marked_seen` | `{ chatId: string, messageIds: string[], seenBy: string }` | Mensajes vistos |
| `error` | `{ message: string }` | Error en operación |

## 7\. Estructura del Objeto Mensaje

Este es el formato esperado para los objetos `Message` recibidos en el evento `new_message`:

```json
{
  "_id": "string",
  "chatId": "string",
  "senderId": {
    "_id": "string",
    "fullName": "string",
    "profileImage": "string" // Opcional
  },
  "receiverId": "string",
  "content": "string",
  "status": "sent" | "delivered" | "seen",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 8\. Mejores Prácticas

### Manejo de Reconexión

Añade lógica para re-unirte a chats activos tras una reconexión exitosa.

```javascript
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconectado después de', attemptNumber, 'intentos');
  // Re-unirse a chats activos
  if (activeChat) {
    socket.emit('join_chat', { chatId: activeChat });
  }
});
```

### Paginación de Mensajes

Utiliza llamadas HTTP/REST para cargar el historial de mensajes antes de la conexión del socket o al hacer *scroll up* en el chat.

```javascript
// Cargar mensajes históricos vía HTTP
const loadMessages = async (chatId, token, API_URL, page = 1) => {
  const response = await fetch(
    `${API_URL}/api/messages/${chatId}?page=${page}&limit=20`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const data = await response.json();
  return data.data.messages;
};
```

## 9\. Debugging

Para depurar problemas de conexión y eventos en el cliente:

```javascript
// Activar logs de Socket.io (opcional)
const socket = io(SOCKET_URL, {
  auth: { token: `Bearer ${token}` },
  transports: ['websocket', 'polling'], // Especificar transportes
});

// Ver todos los eventos que entran y salen del socket
socket.onAny((event, ...args) => {
  console.log('Socket event:', event, args);
});
```

## 10\. Variables de Entorno

Asegúrate de definir la URL del servidor WebSocket en tu archivo de entorno:

**`.env`**

```dotenv
VITE_APP_URL=http://localhost:3000
```

Para producción:

```dotenv
VITE_APP_URL=[https://tu-dominio.com](https://tu-dominio.com)
```

```
```