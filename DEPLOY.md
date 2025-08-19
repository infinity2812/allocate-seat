# 🚀 Deploy to Vercel

## Quick Deploy

1. **Push to GitHub**
```bash
cd scripts/allocate-seat-app
git init
git add .
git commit -m "Initial commit: Paystream Seat Allocator"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub
- Click "New Project"
- Import your repository
- Deploy! 🎉

## Environment Variables

In your Vercel project settings, add:
```bash
NEXT_PUBLIC_RPC_URL=https://martita-mj6c17-fast-mainnet.helius-rpc.com
```

## What's Fixed

✅ **No more prefilled wallet** - users must upload their own
✅ **Proper Anchor provider** - uses real Anchor provider instead of fake one
✅ **Vercel ready** - proper Next.js app structure
✅ **Real SDK integration** - imports your actual Paystream code

## Local Development

```bash
cd scripts/allocate-seat-app
npm install
npm run dev
```

## Production

The app will be live at `https://your-project.vercel.app`

## Features

- 🎯 **Real Paystream SDK** - imports your actual types and clients
- 🔐 **Wallet upload** - users upload their admin wallet JSON
- 📱 **Responsive design** - works on all devices
- 🚀 **Vercel deployment** - production ready
- 📊 **Real-time logs** - see transaction progress
