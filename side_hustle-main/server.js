const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Check if certificates exist
const certDir = path.join(__dirname, 'certificates');
const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('Error: SSL certificates not found!');
  console.error(`Expected to find certificates at: ${certDir}`);
  console.error('Please run "npm run generate-certs" first to generate the certificates.');
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${PORT}`);
    console.log('> Using custom SSL certificates for trusted HTTPS');
    console.log('> This environment should work properly with service workers and push notifications');
  });
}).catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
}); 