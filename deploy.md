# Deployment Guide for Hostinger

This guide will help you deploy your Customer Chat Application to Hostinger.

## Prerequisites

1. **Hostinger Account** with hosting plan
2. **Domain name** (or subdomain)
3. **MongoDB Atlas** account (free tier available)
4. **Git** installed on your local machine

## Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (free tier: M0)

2. **Configure Database**
   - Create database user with password
   - Whitelist your IP address (or use 0.0.0.0/0 for all)
   - Get connection string

3. **Update Backend Config**
   - Edit `backend/config.production.env`
   - Replace `your_username`, `your_password`, `your_cluster` with actual values
   - Update `FRONTEND_URL` with your domain

## Step 2: Prepare Frontend for Production

1. **Update Configuration**
   ```bash
   cd frontend/src/config/config.js
   # Replace 'your-domain.com' with your actual domain
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Upload Frontend Files**
   - Upload contents of `frontend/dist/` to your Hostinger public_html folder
   - Or use Hostinger's Git integration

## Step 3: Deploy Backend to Hostinger

### Option A: Using Hostinger's Node.js Hosting

1. **Enable Node.js**
   - Go to Hostinger Control Panel
   - Enable Node.js for your domain
   - Set Node.js version to 18.x or higher

2. **Upload Backend Files**
   - Upload all backend files to your hosting directory
   - Make sure `package.json` is in the root

3. **Install Dependencies**
   - Use Hostinger's terminal or SSH access
   ```bash
   npm install --production
   ```

4. **Set Environment Variables**
   - In Hostinger Control Panel, set environment variables:
     - `NODE_ENV=production`
     - `PORT=5000`
     - `MONGODB_URI=your_mongodb_connection_string`
     - `JWT_SECRET=your_secret_key`
     - `FRONTEND_URL=https://your-domain.com`

5. **Start Application**
   ```bash
   npm start
   ```

### Option B: Using Hostinger's VPS (Recommended)

1. **Access VPS via SSH**
   ```bash
   ssh u123456789@your-server-ip
   ```

2. **Install Node.js and PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone and Setup**
   ```bash
   git clone your-repository-url
   cd customer-chat-app/backend
   npm install --production
   ```

4. **Configure Environment**
   ```bash
   cp config.production.env .env
   nano .env  # Edit with your values
   ```

5. **Start with PM2**
   ```bash
   pm2 start server.js --name "customer-chat-api"
   pm2 startup
   pm2 save
   ```

## Step 4: Configure Domain and SSL

1. **Point Domain to Hostinger**
   - Update DNS records to point to Hostinger nameservers
   - Wait for propagation (up to 24 hours)

2. **Enable SSL Certificate**
   - In Hostinger Control Panel, enable free SSL certificate
   - This gives you HTTPS://your-domain.com

## Step 5: Test Deployment

1. **Test Frontend**
   - Visit https://your-domain.com
   - Should see your React app

2. **Test Backend API**
   - Visit https://your-domain.com/health
   - Should see health status

3. **Test Chat Functionality**
   - Register a new user
   - Try sending messages
   - Check real-time updates

## Step 6: Production Optimizations

1. **Enable Compression**
   ```javascript
   // In backend/server.js
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Rate Limiting**
   ```javascript
   // In backend/server.js
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

3. **Security Headers**
   ```javascript
   // In backend/server.js
   const helmet = require('helmet');
   app.use(helmet());
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend config
   - Ensure domain matches exactly

2. **MongoDB Connection Failed**
   - Verify connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Socket.IO Not Working**
   - Check if WebSocket is enabled on hosting
   - Verify Socket.IO URL in frontend config

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Debug Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs customer-chat-api

# Restart application
pm2 restart customer-chat-api

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI
```

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor MongoDB Atlas usage
   - Check application logs

2. **Backup**
   - Regular database backups
   - Code repository backups
   - Environment configuration backup

3. **Monitoring**
   - Set up uptime monitoring
   - Monitor error logs
   - Track performance metrics

## Support

- **Hostinger Support**: Available 24/7 via live chat
- **MongoDB Atlas**: Community forums and documentation
- **Application Issues**: Check logs and error messages

## Cost Estimation

- **Hosting**: $2-10/month (shared hosting) or $5-20/month (VPS)
- **Domain**: $10-15/year
- **MongoDB Atlas**: Free tier available, paid plans from $9/month
- **SSL Certificate**: Free with Hostinger

## Final Notes

- Always test in development before deploying
- Keep sensitive information in environment variables
- Monitor your application after deployment
- Have a rollback plan ready
- Document your deployment process for future reference
