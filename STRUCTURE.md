# Studio Y7 - Complete Project Structure

```
Studio-Y7/
│
├── 📁 backend/                          # Node.js + Express Backend
│   │
│   ├── 📁 config/                       # Configuration files
│   │   ├── cloudinary.js               # Cloudinary setup for image storage
│   │   └── db.js                       # MongoDB connection
│   │
│   ├── 📁 controllers/                 # Business logic
│   │   ├── authController.js          # Admin authentication (login/register)
│   │   ├── bookingController.js       # Booking management + Razorpay
│   │   ├── contactController.js       # Contact form submissions
│   │   ├── contentController.js       # Dynamic site content
│   │   ├── galleryController.js       # Portfolio image management
│   │   ├── heroController.js          # Hero image management
│   │   └── testimonialController.js   # Client testimonials
│   │
│   ├── 📁 middleware/                  # Custom middleware
│   │   ├── authMiddleware.js          # JWT authentication protection
│   │   └── uploadMiddleware.js        # Multer file upload handling
│   │
│   ├── 📁 models/                      # MongoDB schemas
│   │   ├── Admin.js                   # Admin users (email, hashed password)
│   │   ├── Booking.js                 # Customer bookings
│   │   ├── Contact.js                 # Contact enquiries
│   │   ├── Gallery.js                 # Portfolio images
│   │   ├── HeroImage.js               # Homepage hero image
│   │   ├── SiteContent.js             # Dynamic content sections
│   │   └── Testimonial.js             # Client reviews
│   │
│   ├── 📁 routes/                      # API endpoints
│   │   ├── authRoutes.js              # /api/auth/*
│   │   ├── bookingRoutes.js           # /api/bookings/*
│   │   ├── contactRoutes.js           # /api/contacts/*
│   │   ├── contentRoutes.js           # /api/content/*
│   │   ├── galleryRoutes.js           # /api/gallery/*
│   │   ├── heroRoutes.js              # /api/hero/*
│   │   └── testimonialRoutes.js       # /api/testimonials/*
│   │
│   ├── 📁 uploads/                     # Temporary file storage
│   │   └── .gitkeep                   # Keep folder in git
│   │
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Git ignore rules
│   ├── package.json                    # Dependencies & scripts
│   ├── seed.js                         # Database seeding script
│   └── server.js                       # Main entry point
│
├── 📁 client/                           # React + Vite Frontend
│   │
│   ├── 📁 public/                       # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 assets/
│   │   │   └── 📁 images/              # Local images (logo, placeholders)
│   │   │       ├── logo.png
│   │   │       ├── couple1.jpg        # Default hero image
│   │   │       └── ...
│   │   │
│   │   ├── 📁 components/              # React components
│   │   │   │
│   │   │   ├── Navbar.jsx             # ✨ Floating glass navigation
│   │   │   ├── Hero.jsx               # 🎬 Hero section with parallax
│   │   │   ├── About.jsx              # 📖 Studio story & mission
│   │   │   ├── Services.jsx           # 💼 Bento grid services
│   │   │   ├── Portfolio.jsx          # 📸 Masonry gallery with lightbox
│   │   │   ├── Pricing.jsx            # 💰 3-tier pricing packages
│   │   │   ├── Testimonials.jsx       # ⭐ Client reviews
│   │   │   ├── Booking.jsx            # 📅 Booking form
│   │   │   ├── Contact.jsx            # ✉️ Contact form
│   │   │   ├── Footer.jsx             # 🦶 Footer with links
│   │   │   └── ProtectedRoute.jsx     # 🔒 Admin route protection
│   │   │
│   │   ├── 📁 pages/                   # Page components
│   │   │   ├── AdminLogin.jsx         # 🔐 Admin authentication
│   │   │   └── AdminDashboard.jsx     # 🎛️ Complete CMS dashboard
│   │   │
│   │   ├── 📁 services/                # API & state management
│   │   │   ├── api.js                 # 🔌 Axios API client
│   │   │   └── store.js               # 🗄️ Zustand state management
│   │   │
│   │   ├── App.jsx                     # Main app with routes
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # 🎨 Tailwind + custom styles
│   │
│   ├── .env.example                    # Environment variables template
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Dependencies & scripts
│   └── vite.config.js                  # Vite configuration
│
├── 📄 README.md                         # 📚 Complete documentation
├── 📄 QUICKSTART.md                     # ⚡ Quick setup guide
├── 📄 PROJECT_SUMMARY.md                # 📋 What was built
├── 📄 CHECKLIST.md                      # ✅ Setup checklist
├── 📄 API_DOCUMENTATION.md              # 🔌 API endpoints reference
└── 📄 STRUCTURE.md                      # 📂 This file

```

---

## 🔄 Data Flow

### Customer Flow
```
Customer
   ↓
Browser → http://localhost:5173
   ↓
React App loads
   ↓
Fetches data from API → http://localhost:5000/api
   ↓
API queries MongoDB
   ↓
Returns data (images, testimonials, etc.)
   ↓
React displays content
```

### Admin Flow
```
Admin
   ↓
Login → /admin/login
   ↓
Submits credentials
   ↓
Backend validates → Returns JWT token
   ↓
Token stored in localStorage
   ↓
Admin Dashboard → /admin/dashboard
   ↓
Uploads image via form
   ↓
Multer saves to temp folder
   ↓
Cloudinary stores permanently
   ↓
MongoDB saves metadata
   ↓
Frontend fetches updated data
   ↓
Homepage portfolio updates automatically
```

---

## 🎯 Key Files Explained

### Backend

**server.js**
- Entry point
- Express app setup
- Middleware configuration
- Route mounting
- Server startup

**models/Gallery.js**
- Defines image schema
- Fields: title, imageUrl, cloudinaryId, category, featured, order
- Enables dynamic portfolio

**controllers/galleryController.js**
- Upload image logic
- Cloudinary integration
- Delete image (removes from both Cloudinary and MongoDB)
- Update image metadata
- Reorder images

**middleware/authMiddleware.js**
- Protects admin routes
- Validates JWT token
- Attaches admin to request

### Frontend

**App.jsx**
- Route definitions
- Home page (all customer components)
- Admin login
- Admin dashboard (protected)

**components/Portfolio.jsx**
- Fetches images from API
- CSS Masonry layout
- Category filtering
- Lightbox with keyboard navigation
- Framer Motion animations

**services/api.js**
- Axios instance
- All API endpoints organized
- JWT token injection
- Error handling

**services/store.js**
- Zustand stores
- Auth state (admin, token)
- Gallery state (images)
- Persistent login (localStorage)

**pages/AdminDashboard.jsx**
- Complete CMS
- Image upload
- Booking management
- Contact viewing
- Testimonial management
- Statistics overview

---

## 📦 Dependencies

### Backend
```json
{
  "express": "REST API framework",
  "mongoose": "MongoDB ODM",
  "dotenv": "Environment variables",
  "cors": "Cross-origin requests",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "multer": "File uploads",
  "cloudinary": "Image storage",
  "razorpay": "Payment gateway"
}
```

### Frontend
```json
{
  "react": "UI library",
  "react-router-dom": "Routing",
  "framer-motion": "Animations",
  "tailwindcss": "Styling",
  "axios": "HTTP client",
  "zustand": "State management",
  "react-icons": "Icon library"
}
```

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=random_secure_string
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=...
```

---

## 🎨 Design System

### Colors
```css
--bg-primary: #F7F5F2      /* Warm background */
--bg-secondary: #F3EFE9    /* Alternate sections */
--text-primary: #1F1F1F    /* Headings */
--text-secondary: #666666  /* Body text */
--accent: #C56A45          /* Terracotta - primary CTA */
--accent-secondary: #73856D /* Muted olive - secondary */
--card: rgba(255,255,255,0.60) /* Glass effect */
--border: rgba(0,0,0,0.08) /* Subtle borders */
```

### Typography
```css
font-family: 'Playfair Display', serif; /* Headings */
font-family: 'Inter', sans-serif;       /* Body */
```

### Spacing
```css
section-padding: 120px 24px; /* Desktop */
section-padding: 80px 20px;  /* Mobile */
```

---

## 🚀 Commands Reference

### Development
```bash
# Backend
cd backend
npm install
npm run seed    # Create admin account
npm run dev     # Start server

# Frontend
cd client
npm install
npm run dev     # Start dev server
```

### Production
```bash
# Backend
npm start       # Production mode

# Frontend
npm run build   # Build for production
npm run preview # Preview production build
```

---

## 📊 Database Collections

```
studioy7 (database)
├── admins           # Admin users
├── galleries        # Portfolio images
├── heroimages       # Hero section images
├── bookings         # Customer bookings
├── contacts         # Contact enquiries
├── testimonials     # Client reviews
└── sitecontents     # Dynamic content
```

---

Built with precision for Studio Y7 Photography 📸
