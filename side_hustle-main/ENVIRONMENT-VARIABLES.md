# Environment Variables Guide

This document explains all the environment variables required for this Firebase Cloud Messaging project.

## Required Environment Variables

### Firebase Configuration

| Variable Name | Description | Example Value |
|---------------|-------------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | `AIzaSyB0Nxf3pvW32KBc0D1o2-K6qIeKovhGWfg` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123456789012:web:abc123def456` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID (optional) | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY` | VAPID key for web push notifications | `BL_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

### Firebase Admin SDK (Server-side)

| Variable Name | Description | Example Value |
|---------------|-------------|--------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID for admin SDK | `your-project-id` |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email | `firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | `-----BEGIN PRIVATE KEY-----\nXXXXXX...\n-----END PRIVATE KEY-----\n` |

### Supabase Configuration

| Variable Name | Description | Example Value |
|---------------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxxxxxxxxxxxxxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for server operations | `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

## Environment Files

This project uses two main environment files:

1. `.env`: Template file with empty values, version controlled
2. `.env.local`: Local development values, not version controlled

## Deployment Environment Variables

### Netlify

All environment variables should be configured in the Netlify UI under:
- Site settings → Build & deploy → Environment → Environment variables

Special considerations for Netlify:
- For `FIREBASE_PRIVATE_KEY`, add the value with literal `\n` characters which will be converted properly during build.
- Ensure you enable environment variable encryption for sensitive values.

## Local Development

For local development with HTTPS:

1. Run `npm run generate-certs` to create local self-signed certificates
2. Run `npm run setup-trusted-dev` to set up trusted certificates (requires admin privileges)
3. Run `npm run dev:trusted` to start the development server with HTTPS

## Troubleshooting

If you encounter issues with environment variables:

1. **Firebase Admin SDK Issues**: Ensure the private key is properly formatted with newline characters
2. **VAPID Key Issues**: Verify that your VAPID key is correctly generated from the Firebase console
3. **Netlify Deployment**: Check Netlify logs for any environment variable related errors 