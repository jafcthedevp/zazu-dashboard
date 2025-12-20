# 📚 Documentación API - Notificaciones

Base URL: `https://brgzom3jw4.execute-api.us-east-1.amazonaws.com`

---

## 📋 1. GET /notifications
**Obtener todas las notificaciones con paginación**

### Request
```bash
GET /notifications?limit=20&last_key={"id":"abc123"}
```

### Query Parameters
| Parámetro | Tipo | Requerido | Descripción | Default |
|-----------|------|-----------|-------------|---------|
| `limit` | integer | No | Cantidad de resultados a retornar | 20 |
| `last_key` | string (JSON) | No | Clave para paginación (obtener más resultados) | - |

### Response 200 OK
```json
{
  "count": 20,
  "has_more": true,
  "last_key": "{\"id\":\"550e8400-e29b-41d4-a716-446655440000\"}",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "device_id": "TK-0111",
      "name": "Juan Pérez",
      "amount": 50.00,
      "code": "123",
      "timestamp": 1765957308785,
      "status": "pending"
    },
    {
      "id": "abc-def-456",
      "device_id": "TK-0112",
      "name": "María García",
      "amount": 100.50,
      "code": "456",
      "timestamp": 1765957308786,
      "status": "validated"
    }
  ]
}
```

### Ejemplos
```bash
# Obtener las primeras 20 notificaciones
curl https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications

# Obtener solo 10 resultados
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications?limit=10"

# Obtener la siguiente página
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications?limit=20&last_key=%7B%22id%22%3A%22abc123%22%7D"
```

---

## 🔍 2. GET /notifications/{id}
**Obtener una notificación específica por ID**

### Request
```bash
GET /notifications/550e8400-e29b-41d4-a716-446655440000
```

### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (UUID) | ID único de la notificación |

### Response 200 OK
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "device_id": "TK-0111",
    "name": "Juan Pérez",
    "amount": 50.00,
    "code": "123",
    "timestamp": 1765957308785,
    "status": "pending"
  }
}
```

### Response 404 Not Found
```json
{
  "error": "Notification not found"
}
```

### Ejemplos
```bash
curl https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/550e8400-e29b-41d4-a716-446655440000
```

---

## 📊 3. GET /notifications/status/{status}
**Obtener notificaciones filtradas por estado**

### Request
```bash
GET /notifications/status/pending?limit=15
```

### Path Parameters
| Parámetro | Tipo | Valores | Descripción |
|-----------|------|---------|-------------|
| `status` | string | `pending`, `validated`, `rejected` | Estado de la notificación |

### Query Parameters
| Parámetro | Tipo | Requerido | Descripción | Default |
|-----------|------|-----------|-------------|---------|
| `limit` | integer | No | Cantidad de resultados | 20 |
| `last_key` | string (JSON) | No | Clave para paginación | - |

### Response 200 OK
```json
{
  "status": "pending",
  "count": 15,
  "has_more": true,
  "last_key": "{\"status\":\"pending\",\"timestamp\":1765957308785}",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "device_id": "TK-0111",
      "name": "Juan Pérez",
      "amount": 50.00,
      "code": "123",
      "timestamp": 1765957308785,
      "status": "pending"
    }
  ]
}
```

### Response 400 Bad Request
```json
{
  "error": "Invalid status. Must be one of: pending, validated, rejected"
}
```

### Ejemplos
```bash
# Notificaciones pendientes
curl https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/status/pending

# Notificaciones validadas (límite 10)
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/status/validated?limit=10"

# Notificaciones rechazadas
curl https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/status/rejected
```

---

## 📱 4. GET /notifications/device/{device_id}
**Obtener notificaciones de un dispositivo específico**

### Request
```bash
GET /notifications/device/TK-0111?limit=10
```

### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `device_id` | string | ID del dispositivo |

### Query Parameters
| Parámetro | Tipo | Requerido | Descripción | Default |
|-----------|------|-----------|-------------|---------|
| `limit` | integer | No | Cantidad de resultados | 20 |
| `last_key` | string (JSON) | No | Clave para paginación | - |

### Response 200 OK
```json
{
  "device_id": "TK-0111",
  "count": 10,
  "has_more": false,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "device_id": "TK-0111",
      "name": "Juan Pérez",
      "amount": 50.00,
      "code": "123",
      "timestamp": 1765957308785,
      "status": "pending"
    },
    {
      "id": "abc-def-456",
      "device_id": "TK-0111",
      "name": "María García",
      "amount": 25.00,
      "code": "000",
      "timestamp": 1765957308790,
      "status": "validated"
    }
  ]
}
```

### Ejemplos
```bash
# Todas las notificaciones del dispositivo TK-0111
curl https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/device/TK-0111

# Últimas 5 notificaciones del dispositivo
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/device/TK-0111?limit=5"
```

---

## 🔎 5. GET /notifications/search
**Búsqueda avanzada con múltiples filtros**

### Request
```bash
GET /notifications/search?status=pending&min_amount=10&max_amount=100&name=Juan&limit=20
```

### Query Parameters
| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `status` | string | No | Filtrar por estado | `pending` |
| `device_id` | string | No | Filtrar por dispositivo | `TK-0111` |
| `name` | string | No | Buscar por nombre (contiene) | `Juan` |
| `min_amount` | decimal | No | Monto mínimo | `10` |
| `max_amount` | decimal | No | Monto máximo | `100` |
| `from_timestamp` | integer | No | Timestamp desde | `1765957308785` |
| `to_timestamp` | integer | No | Timestamp hasta | `1765999999999` |
| `code` | string | No | Código exacto | `123` |
| `limit` | integer | No | Cantidad de resultados | 20 |
| `last_key` | string | No | Paginación | - |

### Response 200 OK
```json
{
  "filters_applied": {
    "status": "pending",
    "device_id": null,
    "name": "Juan",
    "min_amount": "10",
    "max_amount": "100",
    "from_timestamp": null,
    "to_timestamp": null,
    "code": null
  },
  "count": 5,
  "has_more": false,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "device_id": "TK-0111",
      "name": "Juan Pérez",
      "amount": 50.00,
      "code": "123",
      "timestamp": 1765957308785,
      "status": "pending"
    }
  ]
}
```

### Ejemplos
```bash
# Buscar notificaciones pendientes entre S/ 10 y S/ 100
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/search?status=pending&min_amount=10&max_amount=100"

# Buscar por nombre
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/search?name=Juan"

# Buscar por código específico
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/search?code=123"

# Buscar en rango de fechas
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/search?from_timestamp=1765957308785&to_timestamp=1765999999999"

# Combinar múltiples filtros
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/search?device_id=TK-0111&status=validated&min_amount=50"

# Búsqueda con paginación
curl "https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/search?status=pending&limit=10"
```

---

## ✏️ 6. PUT /notifications/{id}/status
**Actualizar el estado de una notificación**

### Request
```bash
PUT /notifications/550e8400-e29b-41d4-a716-446655440000/status
Content-Type: application/json

{
  "status": "validated"
}
```

### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (UUID) | ID de la notificación |

### Body Parameters
| Parámetro | Tipo | Valores | Requerido | Descripción |
|-----------|------|---------|-----------|-------------|
| `status` | string | `pending`, `validated`, `rejected` | Sí | Nuevo estado |

### Response 200 OK
```json
{
  "message": "Status updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "device_id": "TK-0111",
    "name": "Juan Pérez",
    "amount": 50.00,
    "code": "123",
    "timestamp": 1765957308785,
    "status": "validated"
  }
}
```

### Response 400 Bad Request
```json
{
  "error": "Invalid status. Must be one of: pending, validated, rejected"
}
```

### Ejemplos
```bash
# Marcar como validado
curl -X PUT https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/550e8400-e29b-41d4-a716-446655440000/status \
  -H "Content-Type: application/json" \
  -d '{"status": "validated"}'

# Marcar como rechazado
curl -X PUT https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/abc-def-456/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'

# Regresar a pendiente
curl -X PUT https://brgzom3jw4.execute-api.us-east-1.amazonaws.com/notifications/xyz-789/status \
  -H "Content-Type: application/json" \
  -d '{"status": "pending"}'
```

---

## 📝 Notas Importantes

### Estados de Notificación
- **`pending`**: Notificación recibida, esperando validación
- **`validated`**: Pago confirmado y validado
- **`rejected`**: Pago rechazado o inválido

### Paginación
Todas las consultas que retornan múltiples resultados soportan paginación:
1. Si `has_more: true`, hay más resultados disponibles
2. Usa el valor de `last_key` en el siguiente request para obtener la siguiente página
3. Recuerda URL-encodear el `last_key` al usarlo en la query string

### Códigos de Seguridad
- **`123`, `456`, etc.**: Códigos de 3 dígitos del formato estándar
- **`000`**: Notificaciones del formato Yape sin código de seguridad

### CORS
Todos los endpoints tienen CORS habilitado con:
```
Access-Control-Allow-Origin: *
```

### Timestamps
Los timestamps están en formato Unix (milisegundos desde epoch):
```javascript
// JavaScript
const date = new Date(1765957308785);

// Python
from datetime import datetime
date = datetime.fromtimestamp(1765957308785 / 1000)
```