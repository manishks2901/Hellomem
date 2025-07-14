# HelloMem E-Commerce - Deployment Guide

## CORS Issue Fix

The CORS issue you were experiencing has been fixed by implementing a proxy configuration for both development and production environments.

## Configuration Changes Made

### 1. Environment Configuration
- Added environment variables to handle different deployment scenarios
- `.env` - Default configuration (uses proxy)
- `.env.local` - Local development (direct API calls)
- `.env.production` - Production deployment (uses proxy)

### 2. Vercel Configuration (`vercel.json`)
- Added proxy rules to forward `/api/*` requests to `https://admin.hellomem.com`
- Added routing fallback for SPA functionality
- Added cache control headers for API requests

### 3. Vite Configuration (`vite.config.ts`)
- Enabled proxy configuration for development
- Proxy forwards `/api/*` requests to `https://admin.hellomem.com`

### 4. Config Updates (`config.ts`)
- Updated to use environment variables
- Now uses `/api/` path which gets proxied to the actual API server

## How It Works

### Development
- API calls go to `/api/*` 
- Vite dev server proxies these to `https://admin.hellomem.com`
- No CORS issues because the request appears to come from the same origin

### Production (Vercel)
- API calls go to `/api/*`
- Vercel rewrites these requests to `https://admin.hellomem.com/*`
- No CORS issues because the proxy handles the cross-origin request

## Deployment Steps

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Fix CORS issue with proxy configuration"
   git push
   ```

2. **Redeploy on Vercel**:
   - Your Vercel deployment will automatically use the new `vercel.json` configuration
   - The proxy will handle all API requests

3. **Test your deployment**:
   - Visit your Vercel URL
   - Check that API calls to `/api/v1/dynamic/dataoperation/get-home-screen-banner` work correctly

## Environment Variables

If you need to override the API base URL for different environments:

- **Development**: Create `.env.local` with `VITE_API_BASE_URL=https://admin.hellomem.com/`
- **Production**: Use the default `/api/` which gets proxied

## Troubleshooting

If you still encounter issues:

1. **Check Vercel deployment logs** for any proxy errors
2. **Verify the API endpoint** is responding correctly
3. **Test the proxy** by visiting `https://your-vercel-url.com/api/v1/dynamic/dataoperation/get-home-screen-banner`

## Notes

- The proxy configuration handles CORS automatically
- All API calls should now use relative paths starting with `/api/`
- The actual API server doesn't need to be modified
- This solution works for both development and production environments
