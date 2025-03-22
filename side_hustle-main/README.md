# Firebase Cloud Messaging Web Push Notifications with Next.js 14

This project demonstrates how to implement web push notifications using Firebase Cloud Messaging (FCM) in a Next.js 14 application. It includes both client-side and service worker implementations for handling notifications in the foreground and background.

## 🚀 Features

- ✅ Web push notifications in both foreground and background states
- ✅ Cross-platform support (iOS and Android differences handled automatically)
- ✅ Duplicate notification prevention
- ✅ Integration with Supabase for subscription storage
- ✅ Development mode support with simulated notifications
- ✅ Full TypeScript support
- ✅ Serverless API routes for sending notifications
- ✅ Comprehensive error handling and user feedback

## 📋 Prerequisites

- Node.js 18+
- Firebase project with Cloud Messaging enabled
- Supabase project (optional, for subscription storage)
- HTTPS for local development (certificates included)

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/firebase-cloud-messaging-web-push-notifications-with-nextjs-14-tutorial.git
cd firebase-cloud-messaging-web-push-notifications-with-nextjs-14-tutorial
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project with the following variables:

```
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY=

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Supabase Configuration (optional)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

For more details on environment variables, see [ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md).

### 4. Set up HTTPS for local development

To test notifications locally, you need HTTPS. This project includes scripts to set up a local HTTPS server:

```bash
# Generate self-signed certificates
npm run generate-certs

# Make certificates trusted (requires admin privileges)
npm run setup-trusted-dev
```

### 5. Start the development server

```bash
# Start with HTTPS and trusted certificates
npm run dev:trusted

# Or start with HTTPS without trusted certificates
npm run dev:https
```

## 🖥️ Usage

1. Open your browser to `https://localhost:3000`
2. Allow notifications when prompted
3. Use the "Send Test Notification" button to test notifications
4. Check that notifications appear both in foreground and background states

## 📚 Project Documentation

- [Project Organization](./PROJECT-ORGANIZATION.md) - Detailed explanation of project structure
- [Environment Variables Guide](./ENVIRONMENT-VARIABLES.md) - Guide to all required environment variables
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Solutions for common issues
- [HTTPS Setup](./HTTPS-SETUP.md) - Detailed instructions for HTTPS setup
- [Supabase Instructions](./supabase-instructions.md) - Guide for Supabase integration

## 📱 Testing Notifications

### Foreground Testing
1. Keep the application tab open in your browser
2. Click the "Send Test Notification" button
3. You should see a toast notification in the application

### Background Testing
1. Open the application in a browser tab
2. Switch to a different tab or minimize the browser
3. Use another device to trigger a notification (or use the API directly)
4. You should receive a system notification

## 🛠️ Deployment

This project is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Configure the environment variables in the Netlify UI
3. Deploy the application

For detailed deployment instructions, see the [Environment Variables Guide](./ENVIRONMENT-VARIABLES.md#deployment-environment-variables).

## 🔍 Key Components

- **firebase.ts** - Client-side Firebase configuration and messaging setup
- **public/firebase-messaging-sw.js** - Service worker for handling background notifications
- **hooks/useFcmToken.tsx** - React hook for managing FCM token and permissions
- **app/api/send-simple-notification/route.ts** - API route for sending notifications

## 🔒 Security Considerations

- The Firebase Admin SDK credentials should never be exposed to the client
- Use environment variables for all sensitive information
- The VAPID key must be properly configured for web push notifications
- Use a secure HTTPS connection for development and production

## ✏️ Customization

- Modify notification styling in `firebase.ts` and `firebase-messaging-sw.js`
- Add custom notification actions in the service worker
- Integrate with your own backend for notification triggers
- Customize the UI in `app/page.tsx`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues, please check the [Troubleshooting Guide](./TROUBLESHOOTING.md) or create an issue in the GitHub repository.
