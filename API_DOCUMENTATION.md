# 🔌 API Documentation

Complete API reference for DoorWin Craft backend endpoints.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication via JWT token:

```http
Authorization: Bearer <token>
```

Or via cookie:
```
Cookie: token=<token>
```

---

## 📋 Contents

1. [Authentication](#authentication-endpoints)
2. [Designs](#designs-endpoints)
3. [Customers](#customers-endpoints)
4. [Orders](#orders-endpoints)
5. [Payments](#payments-endpoints)
6. [Billing](#billing-endpoints)

---

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "orgId": "default-org"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "orgId": "default-org"
  }
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "orgId": "default-org"
  }
}
```

**Rate Limit**: 5 requests per minute per IP

---

## 🎨 Designs Endpoints

### List Designs
```http
GET /api/designs
```

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "design-id",
    "name": "Window 1200x1500mm",
    "config": {
      "type": "window",
      "template": "single",
      "width": 1200,
      "height": 1500,
      ...
    },
    "price": 2500,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Create Design
```http
POST /api/designs
```

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Window Design",
  "config": {
    "type": "window",
    "template": "double",
    "width": 1800,
    "height": 2000,
    "frameDepth": 50,
    "material": "aluminum",
    "color": "#ffffff",
    "glass": true,
    "hardware": {
      "handles": "premium",
      "hinges": "euro",
      "locks": "mortise"
    }
  },
  "price": 3000
}
```

**Response:**
```json
{
  "id": "design-id",
  "name": "My Window Design",
  "config": { ... },
  "price": 3000,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Get Design
```http
GET /api/designs/:id
```

**Response:**
```json
{
  "id": "design-id",
  "name": "My Window Design",
  "config": { ... },
  "price": 3000,
  ...
}
```

---

### Update Design
```http
PUT /api/designs/:id
```

**Request Body:** Same as Create Design

**Response:** Updated design object

---

### Delete Design
```http
DELETE /api/designs/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Design deleted"
}
```

---

## 👥 Customers Endpoints

### List Customers
```http
GET /api/customers
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
[
  {
    "id": "customer-id",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "address": "Riyadh, Saudi Arabia",
    "notes": "VIP customer",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**Rate Limit**: 30 requests per minute per IP

---

### Create Customer
```http
POST /api/customers
```

**Request Body:**
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "address": "Riyadh, Saudi Arabia",
  "notes": "VIP customer"
}
```

**Response:**
```json
{
  "id": "customer-id",
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "address": "Riyadh, Saudi Arabia",
  "notes": "VIP customer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Update Customer
```http
PUT /api/customers/:id
```

**Request Body:** Same as Create Customer

**Response:** Updated customer object

---

### Delete Customer
```http
DELETE /api/customers/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted"
}
```

---

## 📦 Orders Endpoints

### List Orders
```http
GET /api/orders
```

**Query Parameters:**
- `status` (optional): Filter by status (DRAFT, QUOTE_SENT, etc.)
- `customerId` (optional): Filter by customer

**Response:**
```json
[
  {
    "id": "order-id",
    "orderNumber": "ORD-2024-001",
    "status": "QUOTE_SENT",
    "subtotal": 10000,
    "vat": 1500,
    "total": 11500,
    "customer": {
      "id": "customer-id",
      "name": "Ahmed Ali",
      ...
    },
    "items": [
      {
        "id": "item-id",
        "quantity": 2,
        "price": 5000,
        "design": { ... }
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "customerId": "customer-id",
  "items": [
    {
      "designId": "design-id",
      "quantity": 2,
      "price": 5000,
      "notes": "Special installation required"
    }
  ],
  "notes": "Rush order"
}
```

**Response:**
```json
{
  "id": "order-id",
  "orderNumber": "ORD-2024-001",
  "status": "DRAFT",
  "subtotal": 10000,
  "vat": 1500,
  "total": 11500,
  "items": [ ... ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Note**: VAT is automatically calculated at 15% (KSA rate)

---

### Update Order Status
```http
PUT /api/orders/:id/status
```

**Request Body:**
```json
{
  "status": "QUOTE_SENT"
}
```

**Available Statuses:**
- `DRAFT`
- `QUOTE_SENT`
- `QUOTE_ACCEPTED`
- `IN_PRODUCTION`
- `READY_FOR_INSTALLATION`
- `INSTALLED`
- `COMPLETED`
- `CANCELLED`

---

## 💳 Payments Endpoints

### Create Payment Intent
```http
POST /api/payments/create
```

**Request Body:**
```json
{
  "gateway": "tap",
  "amount": 10000,
  "currency": "SAR",
  "orgId": "default-org"
}
```

**Response (Tap):**
```json
{
  "gateway": "tap",
  "charge": {
    "transaction": {
      "url": "https://tap.com/pay/..."
    }
  }
}
```

**Response (Stripe):**
```json
{
  "gateway": "stripe",
  "client_secret": "pi_xxx_secret_xxx",
  "amount": 10000,
  "currency": "SAR"
}
```

**Response (Moyasar):**
```json
{
  "gateway": "moyasar",
  "invoice": {
    "url": "https://moyasar.com/invoice/..."
  }
}
```

---

## 💰 Billing Endpoints

### Get Billing Status
```http
GET /api/billing?orgId=default-org
```

**Response:**
```json
{
  "status": "trial",
  "trialEndsAt": "2024-01-02T00:00:00Z",
  "subscriptionId": null,
  "currentPeriodEnd": null
}
```

**Status Values:**
- `trial`: Free trial period
- `active`: Active subscription
- `past_due`: Payment failed
- `cancelled`: Subscription cancelled

---

## ⚠️ Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests (Rate Limited)
- `500`: Internal Server Error

---

## 🔒 Rate Limiting

Some endpoints have rate limiting:
- **Authentication**: 5 requests/minute per IP
- **Customer API**: 30 requests/minute per IP
- **General API**: 100 requests/minute per IP

Rate limit headers:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1609459200
```

---

## 📝 Example Usage

### JavaScript/TypeScript
```typescript
const token = localStorage.getItem('token');

// Create a design
const response = await fetch('/api/designs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Window',
    config: { /* design config */ }
  })
});

const design = await response.json();
```

### cURL
```bash
curl -X POST http://localhost:3000/api/designs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Window",
    "config": {
      "type": "window",
      "template": "single",
      "width": 1200,
      "height": 1500
    }
  }'
```

---

## 🔐 Security Notes

1. **Always use HTTPS** in production
2. **Store tokens securely** (httpOnly cookies recommended)
3. **Validate input** on both client and server
4. **Implement CSRF protection** for state-changing operations
5. **Monitor rate limits** and implement exponential backoff

---

**Last Updated**: 2024-01-01


