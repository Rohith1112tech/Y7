# Studio Y7 - Setup Checklist

Use this checklist to set up and launch your photography studio website.

## 🔧 Initial Setup

### Backend Setup
- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set `MONGODB_URI` (local: `mongodb://localhost:27017/studioy7` or Atlas connection string)
- [ ] Set `JWT_SECRET` (any random secure string, e.g., generate at: randomkeygen.com)
- [ ] Set `CLIENT_URL` (default: `http://localhost:5173`)
- [ ] Get Cloudinary credentials from cloudinary.com/console
  - [ ] Set `CLOUDINARY_CLOUD_NAME`
  - [ ] Set `CLOUDINARY_API_KEY`
  - [ ] Set `CLOUDINARY_API_SECRET`
- [ ] (Optional) Get Razorpay credentials from dashboard.razorpay.com
  - [ ] Set `RAZORPAY_KEY_ID`
  - [ ] Set `RAZORPAY_KEY_SECRET`
- [ ] Run `npm run seed` to create admin account
- [ ] Run `npm run dev` to start server
- [ ] Verify backend runs on http://localhost:5000

### Frontend Setup
- [ ] Navigate to `client` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_API_URL` (default: `http://localhost:5000/api`)
- [ ] (Optional) Set `VITE_RAZORPAY_KEY_ID` if using payments
- [ ] Run `npm run dev` to start frontend
- [ ] Verify frontend runs on http://localhost:5173

## 🧪 Testing

### Customer Website Testing
- [ ] Open http://localhost:5173
- [ ] Verify hero section loads
- [ ] Scroll through all sections (About, Services, Portfolio, Pricing, Testimonials, Booking, Contact)
- [ ] Click navigation links
- [ ] Test mobile menu (resize browser)
- [ ] Submit contact form
- [ ] Submit booking form
- [ ] Test portfolio filters
- [ ] Open lightbox and test keyboard navigation (arrow keys, Esc)

### Admin Dashboard Testing
- [ ] Go to http://localhost:5173/admin/login
- [ ] Login with:
  - Email: `admin@studioy7.com`
  - Password: `admin123`
- [ ] Verify dashboard loads
- [ ] Test image upload in Gallery section
- [ ] Verify uploaded image appears in homepage portfolio
- [ ] Test hero image upload
- [ ] View bookings (if any)
- [ ] View contacts (if any)
- [ ] Test logout
- [ ] Verify you're redirected to login

## 🎨 Customization

### Replace Default Images
- [ ] Login to admin dashboard
- [ ] Go to Gallery section
- [ ] Upload your actual photography images
- [ ] Categorize each image (Wedding, Couple, Portrait, Outdoor, Events)
- [ ] Go to Hero Image section
- [ ] Upload your hero image
- [ ] Verify homepage updates

### Update Contact Information
- [ ] Update phone number in:
  - [ ] `client/src/components/Contact.jsx`
  - [ ] `client/src/components/Footer.jsx`
- [ ] Update email address in same files
- [ ] Update social media links:
  - [ ] WhatsApp link
  - [ ] Instagram link
  - [ ] Facebook link
- [ ] Update location/address

### Update Site Content
- [ ] Edit hero headline in `client/src/components/Hero.jsx`
- [ ] Edit about section text in `client/src/components/About.jsx`
- [ ] Edit services in `client/src/components/Services.jsx`
- [ ] Edit pricing packages in `client/src/components/Pricing.jsx`
- [ ] Update statistics in hero section (Projects, Clients, Years)

### Add Testimonials
- [ ] Login to admin dashboard
- [ ] Go to Testimonials section
- [ ] Add real client testimonials
- [ ] (Optional) Upload client photos

## 🚀 Pre-Deployment

### Security
- [ ] Change admin password (POST to `/api/auth/register` with new credentials)
- [ ] Generate strong JWT_SECRET
- [ ] Review all .env files
- [ ] Never commit .env files to git
- [ ] Update CORS to specific domain (in `backend/server.js`)

### Database
- [ ] Setup MongoDB Atlas account (mongodb.com/cloud/atlas)
- [ ] Create cluster
- [ ] Get connection string
- [ ] Update MONGODB_URI in backend .env
- [ ] Whitelist IP addresses or allow all (0.0.0.0/0)
- [ ] Test connection

### Cloud Storage
- [ ] Verify Cloudinary account is active
- [ ] Check usage limits
- [ ] Upgrade plan if needed

### Payment (if using)
- [ ] Switch Razorpay from test to live mode
- [ ] Update API keys
- [ ] Test payment flow
- [ ] Complete KYC verification

## 📤 Deployment

### Backend Deployment (Choose one)

#### Option 1: Railway.app
- [ ] Sign up at railway.app
- [ ] Create new project
- [ ] Connect GitHub repo or use CLI
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get production URL

#### Option 2: Render.com
- [ ] Sign up at render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get production URL

#### Option 3: Heroku
- [ ] Sign up at heroku.com
- [ ] Install Heroku CLI
- [ ] Run `heroku create studio-y7-api`
- [ ] Add environment variables
- [ ] Push to Heroku
- [ ] Get production URL

### Frontend Deployment (Choose one)

#### Option 1: Vercel (Recommended)
- [ ] Sign up at vercel.com
- [ ] Import GitHub repo
- [ ] Select `client` folder as root
- [ ] Add environment variables
- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Deploy
- [ ] Get production URL

#### Option 2: Netlify
- [ ] Sign up at netlify.com
- [ ] Drag and drop `client/dist` folder
- [ ] Or connect GitHub repo
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get production URL

### Post-Deployment
- [ ] Update backend `CLIENT_URL` to production frontend URL
- [ ] Test all features on production
- [ ] Test admin login
- [ ] Test image upload
- [ ] Test booking form
- [ ] Test contact form
- [ ] Check mobile responsiveness
- [ ] Test on different browsers (Chrome, Firefox, Safari)

## 🎯 Go Live

### Final Checks
- [ ] Custom domain setup (optional)
- [ ] SSL certificate active (HTTPS)
- [ ] All forms working
- [ ] All images loading
- [ ] Admin dashboard accessible
- [ ] Payment flow tested (if enabled)
- [ ] Contact information correct
- [ ] Social media links working
- [ ] Mobile experience perfect
- [ ] Load time acceptable
- [ ] No console errors

### Marketing
- [ ] Add website to Google Business Profile
- [ ] Share on social media
- [ ] Update Instagram bio link
- [ ] Add to business cards
- [ ] Inform existing clients
- [ ] Create QR code for easy access

## 📊 Post-Launch

### Monitoring
- [ ] Setup Google Analytics (optional)
- [ ] Monitor booking submissions
- [ ] Monitor contact form submissions
- [ ] Check Cloudinary usage
- [ ] Check database size
- [ ] Monitor server performance

### Maintenance
- [ ] Regular backups of database
- [ ] Upload new images monthly
- [ ] Update testimonials regularly
- [ ] Review and respond to enquiries
- [ ] Keep software dependencies updated
- [ ] Monitor for security updates

## 🆘 Troubleshooting

If something doesn't work:

1. **Check backend console** - Look for error messages
2. **Check frontend console** - Open browser DevTools
3. **Verify .env files** - All variables set correctly
4. **Check MongoDB connection** - Database accessible
5. **Check Cloudinary** - Credentials correct
6. **Check CORS** - Backend allows frontend domain
7. **Check API URL** - Frontend points to correct backend
8. **Check ports** - Backend (5000) and Frontend (5173) not in use

## 📞 Support

Need help? Review:
- README.md - Full documentation
- QUICKSTART.md - Quick setup
- PROJECT_SUMMARY.md - What was built

---

✅ When all items are checked, you're ready to serve real customers!

Good luck with Studio Y7! 📸✨
