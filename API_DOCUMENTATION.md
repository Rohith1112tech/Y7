# Studio Y7 - API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All admin endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### POST /auth/register
Create new admin account

**Body:**
```json
{
  "email": "admin@studioy7.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "_id": "...",
  "email": "admin@studioy7.com",
  "token": "jwt_token_here"
}
```

### POST /auth/login
Admin login

**Body:**
```json
{
  "email": "admin@studioy7.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "_id": "...",
  "email": "admin@studioy7.com",
  "token": "jwt_token_here"
}
```

### GET /auth/profile
Get admin profile (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

---

## Gallery Management

### GET /gallery
Get all gallery images (Public)

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Beautiful Wedding",
    "imageUrl": "https://cloudinary.com/...",
    "cloudinaryId": "...",
    "category": "Wedding",
    "featured": false,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /gallery
Upload new image (Protected)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
image: <file>
title: "Image Title"
category: "Wedding" | "Couple" | "Portrait" | "Outdoor" | "Events"
featured: true | false
```

**Response:**
```json
{
  "_id": "...",
  "title": "Image Title",
  "imageUrl": "https://cloudinary.com/...",
  "category": "Wedding"
}
```

### PUT /gallery/:id
Update image details (Protected)

**Body:**
```json
{
  "title": "Updated Title",
  "category": "Portrait",
  "featured": true
}
```

### DELETE /gallery/:id
Delete image (Protected)

**Response:**
```json
{
  "message": "Image deleted"
}
```

### PUT /gallery/reorder/all
Reorder images (Protected)

**Body:**
```json
{
  "images": [
    { "id": "image_id_1" },
    { "id": "image_id_2" }
  ]
}
```

---

## Hero Image

### GET /hero
Get active hero image (Public)

**Response:**
```json
{
  "_id": "...",
  "imageUrl": "https://cloudinary.com/...",
  "cloudinaryId": "...",
  "active": true
}
```

### POST /hero
Upload new hero image (Protected)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
image: <file>
```

### DELETE /hero/:id
Delete hero image (Protected)

---

## Bookings

### POST /bookings
Create booking (Public)

**Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "email": "john@example.com",
  "eventType": "Wedding",
  "eventDate": "2024-12-25",
  "location": "Mumbai",
  "package": "Wedding Essentials",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "status": "Pending",
  "paymentStatus": "Pending"
}
```

### GET /bookings
Get all bookings (Protected)

**Response:**
```json
[
  {
    "_id": "...",
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "email": "john@example.com",
    "eventType": "Wedding",
    "eventDate": "2024-12-25",
    "location": "Mumbai",
    "package": "Wedding Essentials",
    "status": "Pending",
    "paymentStatus": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### PUT /bookings/:id
Update booking status (Protected)

**Body:**
```json
{
  "status": "Approved" | "Completed" | "Cancelled"
}
```

### DELETE /bookings/:id
Delete booking (Protected)

### POST /bookings/payment/create
Create Razorpay order (Public)

**Body:**
```json
{
  "amount": 10000
}
```

**Response:**
```json
{
  "id": "order_...",
  "amount": 1000000,
  "currency": "INR"
}
```

### POST /bookings/payment/verify
Verify payment (Public)

**Body:**
```json
{
  "bookingId": "...",
  "paymentId": "pay_..."
}
```

---

## Contacts

### POST /contacts
Create contact enquiry (Public)

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 98765 43210",
  "subject": "Photography Enquiry",
  "message": "I would like to book a session..."
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "Jane Doe",
  "status": "New",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /contacts
Get all contacts (Protected)

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91 98765 43210",
    "subject": "Photography Enquiry",
    "message": "...",
    "status": "New",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### PUT /contacts/:id
Update contact status (Protected)

**Body:**
```json
{
  "status": "Read" | "Replied"
}
```

### DELETE /contacts/:id
Delete contact (Protected)

---

## Testimonials

### GET /testimonials
Get all active testimonials (Public)

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Happy Client",
    "role": "Bride",
    "content": "Amazing photography!",
    "rating": 5,
    "imageUrl": "https://cloudinary.com/...",
    "active": true
  }
]
```

### POST /testimonials
Create testimonial (Protected)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
name: "Client Name"
role: "Bride"
content: "Testimonial text"
rating: 5
image: <file> (optional)
```

### PUT /testimonials/:id
Update testimonial (Protected)

**Body:**
```json
{
  "name": "Updated Name",
  "role": "Updated Role",
  "content": "Updated content",
  "rating": 5,
  "active": true
}
```

### DELETE /testimonials/:id
Delete testimonial (Protected)

---

## Site Content

### GET /content
Get all site content (Public)

**Response:**
```json
[
  {
    "section": "hero",
    "content": {
      "title": "Capturing Real Stories",
      "subtitle": "..."
    }
  },
  {
    "section": "about",
    "content": {
      "title": "About Us",
      "description": "..."
    }
  }
]
```

### GET /content/:section
Get specific section content (Public)

Example: GET /content/hero

**Response:**
```json
{
  "section": "hero",
  "content": {
    "title": "Capturing Real Stories",
    "subtitle": "..."
  }
}
```

### PUT /content/:section
Update section content (Protected)

**Body:**
```json
{
  "content": {
    "title": "New Title",
    "subtitle": "New Subtitle"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "message": "Error description"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Testing with Postman/Thunder Client

### 1. Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@studioy7.com", "password": "admin123" }
```

Copy the returned token.

### 2. Set Authorization
For all protected endpoints, add header:
```
Authorization: Bearer <paste_token_here>
```

### 3. Upload Image
```
POST http://localhost:5000/api/gallery
Headers: Authorization: Bearer <token>
Body (form-data):
  - image: <select file>
  - title: "Test Image"
  - category: "Wedding"
  - featured: false
```

---

## Rate Limiting (Recommended for Production)

Add rate limiting middleware to prevent abuse:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## CORS Configuration

Current CORS allows `CLIENT_URL` from .env.

For production, update to specific domain:

```javascript
app.use(cors({ 
  origin: 'https://yourdomain.com',
  credentials: true 
}));
```

---

Built for Studio Y7 Photography
