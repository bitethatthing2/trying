# Setting Up Trusted HTTPS for Development

This guide will help you set up a trusted HTTPS environment for local development, which is essential for testing service workers and push notifications.

## Why Trusted HTTPS is Important

Service Workers and Push Notifications require a secure context (HTTPS) to function properly. While Next.js provides built-in support for self-signed certificates, browsers don't trust these certificates by default, which can cause issues with:

- Service Worker registration
- Push API functionality
- Firebase Cloud Messaging

## Option 1: Using mkcert (Recommended)

[mkcert](https://github.com/FiloSottile/mkcert) is a simple tool that creates locally-trusted development certificates. It works by creating a local Certificate Authority (CA) that your browser will trust.

### Step 1: Install mkcert

#### Windows (using Chocolatey)
```
choco install mkcert
```

#### macOS (using Homebrew)
```
brew install mkcert
```

#### Linux
Follow the instructions at https://github.com/FiloSottile/mkcert

### Step 2: Generate Certificates

Run the certificate generation script:
```
npm run generate-certs
```

This will:
1. Install a local CA in your system trust store
2. Generate certificates for localhost
3. Save them to the `certificates` directory

### Step 3: Start the Development Server

```
npm run dev:trusted
```

This will start the development server on port 3000 with trusted HTTPS certificates.

## Option 2: Using Next.js Built-in HTTPS

If you can't install mkcert, you can use Next.js's built-in HTTPS support:

```
npm run dev:port3000
```

However, note that this uses self-signed certificates that browsers don't trust by default. You'll need to:

1. Open https://localhost:3000 in your browser
2. Click "Advanced" and then "Proceed to localhost (unsafe)"
3. Service workers and push notifications may still not work properly

## Troubleshooting

### Certificate Issues

If you see errors related to certificates:

1. Make sure you've generated certificates using `npm run generate-certs`
2. Check that the certificates exist in the `certificates` directory
3. Try restarting your browser to ensure it recognizes the new CA

### Port 3000 Already in Use

If port 3000 is already in use:

1. Find and terminate the process using port 3000:
   ```
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :3000
   kill -9 <PID>
   ```

2. Or use a different port:
   ```
   npm run dev:trusted -- --port 3001
   ```

### Service Worker Registration Fails

If service worker registration still fails:

1. Check the browser console for specific errors
2. Make sure you're using a trusted certificate (Option 1)
3. Try clearing browser cache and service workers:
   - Chrome: chrome://serviceworker-internals/
   - Firefox: about:debugging#/runtime/this-firefox 