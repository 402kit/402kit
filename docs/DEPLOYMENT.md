# Deployment Guide

## Deploying the Browser Demo to Vercel

The 402Kit repository includes a live interactive demo that can be deployed to Vercel.

### Prerequisites

- Vercel account
- Domain connected to your Vercel project (optional but recommended)

### Deployment Steps

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import the `402kit/402kit` repository
   - Vercel will auto-detect the `vercel.json` configuration

2. **Configure Build Settings**

   The project includes a `vercel.json` that configures:
   - Build command: `cd examples/browser && pnpm install && pnpm build`
   - Output directory: `examples/browser/dist`
   - Install command: `pnpm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - The demo will be available at your Vercel URL

4. **Update README**

   After deployment, update the README.md with your live demo URL:

   ```markdown
   [🎮 **Try Live Demo**](https://your-domain.vercel.app)
   ```

### What Gets Deployed

The browser demo is a self-contained interactive demonstration that:

- ✅ Runs entirely in the browser (no backend needed)
- ✅ Simulates HTTP 402 payment flow
- ✅ Uses mock adapter (no real payments)
- ✅ Shows the complete request/response cycle
- ✅ Educational and safe for public access

### Custom Domain (Recommended)

For a professional setup:

1. Add your custom domain in Vercel dashboard
2. Update DNS records as instructed
3. Update the demo URLs in README.md

Example domains:

- `demo.402kit.dev`
- `try.402kit.io`
- `playground.402kit.com`

### Security Considerations

✅ **Safe for public access** because:

- No real payment processing
- No backend API keys
- No user data collection
- Mock adapter only
- Client-side only simulation

### Monitoring

Monitor your demo at:

- Vercel Analytics (built-in)
- Vercel Logs for any build issues
- GitHub Actions for CI/CD status

### Troubleshooting

**Build fails:**

- Check that all dependencies are in `package.json`
- Verify `pnpm-lock.yaml` is committed
- Ensure `vercel.json` paths are correct

**Demo doesn't load:**

- Check browser console for errors
- Verify all assets are in the `dist` folder
- Ensure Vite build completed successfully

**Blank page:**

- Check that `index.html` is in the output directory
- Verify Vite configuration in `examples/browser/vite.config.ts`
