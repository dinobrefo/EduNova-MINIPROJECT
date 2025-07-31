# 🚀 Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, make sure you have:

1. **GitHub Repository**: Your code is pushed to GitHub at `dinobrefo/EduNova-MINIPROJECT`
2. **Sanity Project**: A Sanity project with content
3. **Clerk Application**: A Clerk authentication app
4. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Environment Variables Required

You'll need to set these environment variables in Vercel:

### Sanity Configuration
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token_with_editor_permissions
```

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Deployment Steps

### Method 1: Vercel Web Interface (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**: `dinobrefo/EduNova-MINIPROJECT`
5. **Configure project settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Set Environment Variables**:
   - Click "Environment Variables" in the project settings
   - Add each variable from the list above
   - Make sure to set them for all environments (Production, Preview, Development)

7. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set environment variables
   - Deploy

## Post-Deployment Setup

### 1. Custom Domain (Optional)
- Go to your Vercel project dashboard
- Click "Settings" → "Domains"
- Add your custom domain

### 2. Environment Variables Verification
- Go to your Vercel project dashboard
- Click "Settings" → "Environment Variables"
- Verify all variables are set correctly

### 3. Test Your Application
- Visit your deployed URL
- Test authentication with Clerk
- Test course enrollment
- Test lesson completion functionality

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check that all dependencies are in `package.json`
   - Verify TypeScript compilation
   - Check for missing environment variables

2. **Authentication Issues**:
   - Verify Clerk environment variables
   - Check Clerk application settings
   - Ensure Clerk domains are configured

3. **Sanity Issues**:
   - Verify Sanity project ID and dataset
   - Check API token permissions
   - Ensure content exists in Sanity

4. **Environment Variables**:
   - Double-check all variables are set
   - Ensure no typos in variable names
   - Verify values are correct

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior

### Error Tracking
- Check Vercel function logs for server-side errors
- Monitor client-side errors in browser console

## Updates

To update your deployed application:

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. **Vercel will automatically redeploy** if you have auto-deployment enabled

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check GitHub repository for latest changes

---

**Your EduNova learning platform will be live and ready for users! 🎉** 