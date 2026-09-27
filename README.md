# Studio Y7 - Professional Photography Studio Website

A production-ready, full-stack MERN photography studio website with admin dashboard for complete content management.

## 🎨 Design Features

- **Modern Editorial Design** - Warm color palette with terracotta and olive accents
- **Cinematic & Emotional** - Large images, smooth animations, premium feel
- **Glassmorphism UI** - Soft shadows, rounded corners, glass effects
- **Fully Responsive** - Perfect on desktop, tablet, and mobile
- **Dynamic Content** - All content managed through admin dashboard

## 🏗️ Project Architecture

### Client Website (Customer-Facing)
- Floating glass navigation
- Hero section with dynamic image
- About Studio
- Services (Bento Grid layout)
- Portfolio (CSS Masonry layout with dynamic images from MongoDB)
- Pricing packages
- Testimonials
- Booking form with Razorpay integration
- Contact form
- Footer

### Admin Dashboard (Admin-Only)
- Secure JWT authentication
- Upload/Delete/Manage gallery images
- Upload/Replace hero image
- Manage bookings (approve/delete)
- View contact enquiries
- Manage testimonials
- Dashboard overview with statistics

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- Framer Motion (animations)
- Tailwind CSS 4
- Axios
- Zustand (state management)
- React Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Cloudinary (image storage)
- Razorpay (payments)
- Bcrypt (password hashing)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Razorpay account (for payments)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studioy7
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. Start the server:
```bash
npm run dev
```

Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
npm run dev
```

Client runs on http://localhost:5173

## 👤 Creating Admin Account

Use a tool like Postman or Thunder Client to create the first admin:

**POST** `http://localhost:5000/api/auth/register`

Body:
```json
{
  "email": "admin@studioy7.com",
  "password": "your_secure_password"
}
```

## 🎯 Usage

### Customer Flow
1. Visit homepage at `http://localhost:5173`
2. Browse portfolio, services, pricing
3. Submit booking request
4. Contact via form or social media

### Admin Flow
1. Login at `http://localhost:5173/admin/login`
2. Access dashboard at `http://localhost:5173/admin/dashboard`
3. Upload images to gallery (automatically appear on homepage)
4. Replace hero image (automatically updates homepage)
5. Manage bookings and enquiries
6. View statistics

## 📁 Project Structure

```
Studio-Y7/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   ├── contentController.js
│   │   ├── galleryController.js
│   │   ├── heroController.js
│   │   └── testimonialController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Contact.js
│   │   ├── Gallery.js
│   │   ├── HeroImage.js
│   │   ├── SiteContent.js
│   │   └── Testimonial.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── contentRoutes.js
│   │   ├── galleryRoutes.js
│   │   ├── heroRoutes.js
│   │   └── testimonialRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── components/
│   │   │   ├── About.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Services.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎨 Color Palette

```css
Background: #F7F5F2
Alternate: #F3EFE9
Cards: rgba(255,255,255,0.60)
Text Primary: #1F1F1F
Text Secondary: #666666
Accent: #C56A45 (Terracotta)
Secondary Accent: #73856D (Muted Olive)
Border: rgba(0,0,0,0.08)
```

## 🔐 Security Features

- JWT authentication for admin
- Password hashing with bcrypt
- Protected admin routes
- CORS configuration
- Input validation
- Secure file uploads

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy from GitHub
3. Update CLIENT_URL to production URL

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Update VITE_API_URL to production API URL

### Database (MongoDB Atlas)
1. Create cluster
2. Update MONGODB_URI in backend .env
3. Whitelist IP addresses

## 📝 Key Features

### Dynamic Image Management
- Admin uploads images → Automatically stored in Cloudinary
- Images saved to MongoDB with metadata
- Portfolio displays images dynamically from database
- No code changes needed to add/remove images

### Dynamic Hero Image
- Admin uploads new hero → Replaces homepage hero instantly
- Old hero images archived in database
- Smooth transition without deployment

### Booking System
- Customers submit booking requests
- Admin views all bookings in dashboard
- Admin can approve/reject bookings
- Optional advance payment via Razorpay

## 🤝 Support

For issues or questions, contact: hello@studioy7.com

## 📄 License

Private & Proprietary - Studio Y7 Photography

---

Built with ❤️ using MERN Stack
