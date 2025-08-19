# Paystream Seat Allocator - Next.js App

This is a proper Next.js web application that imports the actual Paystream SDK and runs the real `allocateSeat` logic from your codebase.

## 🚀 What This Does

Instead of recreating everything from scratch, this app:
- ✅ **Imports your actual Paystream SDK** (`@meimfhd/paystream-v1`)
- ✅ **Uses the real market addresses** (USDC_MARKET, SOL_MARKET from your types)
- ✅ **Runs the exact same logic** as your `allocateSeat.ts` script
- ✅ **Beautiful web UI** for easy seat allocation

## 🛠️ Setup

### 1. Install Dependencies
```bash
cd scripts/allocate-seat-app
npm install
# or
yarn install
```

### 2. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

## 🌐 Environment Variables

Create a `.env.local` file:
```bash
NEXT_PUBLIC_RPC_URL=https://martita-mj6c17-fast-mainnet.helius-rpc.com
```

## 📱 Usage

1. **Load Admin Wallet** - Upload your admin JSON wallet file
2. **Enter Address** - Input the address to allocate seats to (pre-filled with your address)
3. **Select Markets** - Choose USDC and/or SOL markets
4. **Click Allocate** - Watch the real transaction happen!

## 🔧 How It Works

The app imports and uses:
- `USDC_MARKET`, `SOL_MARKET`, `USDC_MINT`, `SOL_MINT` from your types
- `PaystreamV1Program` and `PaystreamV1AdminClient` from your SDK
- The exact same `allocateSeatIx` calls as your script

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Deploy! 

The app will work exactly like your command line script but with a beautiful web interface.

## 🎯 Benefits

- **No more command line** - just upload wallet and click
- **Real SDK integration** - uses your actual Paystream code
- **Production ready** - can be deployed and shared
- **Mobile friendly** - works on all devices
