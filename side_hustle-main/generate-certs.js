const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create certificates directory if it doesn't exist
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

console.log('Generating trusted certificates for local development...');

try {
  // Check if mkcert is installed
  try {
    execSync('mkcert -version', { stdio: 'inherit' });
  } catch (error) {
    console.error('mkcert is not installed. Please install it first:');
    console.error('- Windows (with chocolatey): choco install mkcert');
    console.error('- macOS (with homebrew): brew install mkcert');
    console.error('- Linux: Follow instructions at https://github.com/FiloSottile/mkcert');
    process.exit(1);
  }

  // Install local CA
  console.log('Installing local CA...');
  execSync('mkcert -install', { stdio: 'inherit' });

  // Generate certificates
  console.log('Generating certificates...');
  execSync(
    `mkcert -key-file ${path.join(certDir, 'localhost-key.pem')} -cert-file ${path.join(
      certDir,
      'localhost.pem'
    )} localhost 127.0.0.1 ::1`,
    { stdio: 'inherit' }
  );

  console.log('Certificates generated successfully!');
  console.log(`Certificates saved to: ${certDir}`);
  console.log('You can now run "npm run dev:https" to start the development server with HTTPS.');
} catch (error) {
  console.error('Error generating certificates:', error.message);
  process.exit(1);
} 