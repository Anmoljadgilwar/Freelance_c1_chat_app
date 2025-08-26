# Deployment Checklist for Hostinger

## ✅ Pre-Deployment Checklist

### Backend Configuration
- [ ] Update `backend/config.production.env` with your MongoDB Atlas credentials
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Generate a strong `JWT_SECRET`
- [ ] Test backend locally with production config

### Frontend Configuration
- [ ] Update `frontend/src/config/config.js` with your domain
- [ ] Test frontend locally with production config
- [ ] Build frontend: `npm run build`

### MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create cluster (free M0 tier)
- [ ] Create database user with password
- [ ] Whitelist IP addresses (0.0.0.0/0 for all)
- [ ] Get connection string
- [ ] Test connection

## 🚀 Deployment Steps

### Step 1: Frontend Deployment
- [ ] Upload `frontend/dist/` contents to Hostinger public_html
- [ ] Verify frontend loads at your domain
- [ ] Check for any console errors

### Step 2: Backend Deployment
- [ ] Choose hosting method (Shared Hosting or VPS)
- [ ] Upload backend files to hosting directory
- [ ] Install production dependencies: `npm install --production`
- [ ] Set environment variables in hosting control panel
- [ ] Start application: `npm start` or `pm2 start`

### Step 3: Domain & SSL
- [ ] Point domain to Hostinger nameservers
- [ ] Enable SSL certificate
- [ ] Test HTTPS access

### Step 4: Testing
- [ ] Test frontend: https://your-domain.com
- [ ] Test backend API: https://your-domain.com/health
- [ ] Test user registration
- [ ] Test login functionality
- [ ] Test real-time chat
- [ ] Test admin dashboard

## 🔧 Post-Deployment

### Monitoring
- [ ] Check application logs
- [ ] Monitor MongoDB Atlas usage
- [ ] Set up uptime monitoring
- [ ] Test chat functionality regularly

### Security
- [ ] Verify HTTPS is working
- [ ] Check CORS configuration
- [ ] Ensure environment variables are secure
- [ ] Monitor for suspicious activity

### Performance
- [ ] Test chat response times
- [ ] Monitor database performance
- [ ] Check for memory leaks
- [ ] Optimize if needed

## 🚨 Troubleshooting

### Common Issues
- [ ] CORS errors - Check domain configuration
- [ ] MongoDB connection - Verify connection string
- [ ] Socket.IO issues - Check WebSocket support
- [ ] Build errors - Verify Node.js version

### Debug Steps
- [ ] Check hosting logs
- [ ] Verify environment variables
- [ ] Test API endpoints individually
- [ ] Check browser console for errors

## 📋 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Monitor hosting usage
- [ ] Check application performance

### Emergency Procedures
- [ ] Have rollback plan ready
- [ ] Keep backup of working version
- [ ] Document all changes
- [ ] Test after any updates

## 📞 Support Contacts

- **Hostinger Support**: 24/7 Live Chat
- **MongoDB Atlas**: Community Forums
- **Your Team**: [Your Contact Info]

## 📝 Notes

- Deployment Date: _______________
- Domain: _______________
- Hosting Plan: _______________
- MongoDB Cluster: _______________
- Admin Email: _______________

---

**Remember**: Always test in development before deploying to production!
