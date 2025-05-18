# WhatsApp Bot Hosting Panel

## How to Deploy on Railway

1. Visit [https://railway.app](https://railway.app)
2. Sign up and click **New Project**
3. Select **Deploy from GitHub** or **Deploy from Template**
4. Upload this project folder to a GitHub repository
5. Railway will auto-detect `package.json` and deploy it
6. Add environment variables in Railway if needed
7. Access the live URL provided by Railway

## Notes
- Upload your bot ZIP using the panel.
- Your bot must contain `index.js` as the entry point.
- Place a `.env` file inside your ZIP for custom config.

## PM2 Support
Make sure to add a Railway plugin or use a Railway VPS that supports `pm2`.
