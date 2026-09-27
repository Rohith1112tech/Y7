# 🚀 Quick Start Guide - Studio Y7

## Prerequisites Check
- [ ] Node.js installed (v18+)
- [ ] MongoDB installed or Atlas account ready
- [ ] Cloudinary account created
- [ ] Razorpay account created (optional for now)

## Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your credentials
# At minimum, set:
# - MONGODB_URI (use your MongoDB connection string)
# - JWT_SECRET (any random string)
# - Cloudinary credentials

# Seed the database (creates admin account)
npm run seed

# Start backend server
npm run dev
```

Backend should now be running on http://localhost:5000

✅ Default Admin Login Created:
- Email: admin@studioy7.com
- Password: admin123

## Step 2: Frontend Setup (3 minutes)

```bash
# Open new terminal, navigate to client
cd client

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env if needed (default values should work)

# Start frontend
npm run dev
```

Frontend should now be running on http://localhost:5173

## Step 3: Test the Application

### Test Customer Website
1. Open http://localhost:5173
2. You should see the homepage with hero section
3. Navigate through all sections
4. Try submitting a booking (optional)

### Test Admin Dashboard
1. Go to http://localhost:5173/admin/login
2. Login with:
   - Email: admin@studioy7.com
   - Password: admin123
3. You should see the admin dashboard
4. Try uploading an image to the gallery
5. Check if it appears on the homepage portfolio

## Step 4: Configure Cloudinary (Required for uploads)

1. Go to https://cloudinary.com and sign up/login
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add them to `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Restart backend server

## Step 5: Optional - Configure Razorpay (For Payments)

1. Go to https://razorpay.com and create account
2. Get test/live API keys
3. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_secret
   ```
4. Add to `client/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=your_key_id
   ```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Frontend won't start
- Check if backend is running first
- Verify .env file exists
- Check port 5173 is not in use

### Images won't upload
- Verify Cloudinary credentials in backend .env
- Check backend console for errors
- Ensure uploads folder exists in backend

### Can't login to admin
- Run `npm run seed` in backend to create admin
- Check MongoDB connection
- Verify JWT_SECRET is set in .env

## Next Steps

1. ✅ Upload your own images via admin dashboard
2. ✅ Replace the hero image
3. ✅ Add testimonials
4. ✅ Customize site content
5. ✅ Test booking flow
6. ✅ Deploy to production (see README.md)

## Important Security Notes

⚠️ **Before going to production:**
1. Change admin password immediately
2. Use strong JWT_SECRET
3. Enable MongoDB authentication
4. Use environment-specific .env files
5. Enable CORS only for your domain
6. Use HTTPS in production

## Need Help?

- Check README.md for detailed documentation
- Review backend/models for database schemas
- Check client/src/services/api.js for API endpoints
- Inspect browser console for frontend errors
- Check backend console for server errors

---

🎉 **You're all set!** Start building your photography studio website.
