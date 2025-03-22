// Script to prepare assets for Netlify deployment
const fs = require('fs-extra');
const path = require('path');

async function main() {
  try {
    console.log('Starting asset preparation for Netlify deployment...');
    
    // Step 1: Ensure .next directory exists
    await fs.ensureDir('.next');
    console.log('Ensured .next directory exists');
    
    // Step 2: Copy the public directory to .next directory
    console.log('Copying public assets to .next...');
    await fs.copy('public', '.next', {
      filter: (src) => {
        const basename = path.basename(src);
        console.log(`Processing: ${src}`);
        return !basename.startsWith('.'); // Skip hidden files
      },
      overwrite: true
    });
    
    // Step 3: Specifically ensure only_these directory and its contents are copied
    console.log('Ensuring icon assets are available...');
    if (await fs.pathExists('public/only_these')) {
      await fs.ensureDir('.next/only_these');
      const onlyTheseFiles = await fs.readdir('public/only_these');
      console.log(`Found ${onlyTheseFiles.length} files in only_these directory`);
      
      // Copy each file individually to ensure they're all transferred
      for (const file of onlyTheseFiles) {
        const srcPath = path.join('public/only_these', file);
        const destPath = path.join('.next/only_these', file);
        console.log(`Copying ${srcPath} -> ${destPath}`);
        await fs.copy(srcPath, destPath, { overwrite: true });
      }
      console.log('Icon assets copied successfully!');
    } else {
      console.warn('Warning: only_these directory not found in public folder!');
    }

    // Step 4: Ensure logos directory is copied
    console.log('Ensuring logo assets are available...');
    if (await fs.pathExists('public/only_these/logos')) {
      await fs.ensureDir('.next/only_these/logos');
      const logoFiles = await fs.readdir('public/only_these/logos');
      console.log(`Found ${logoFiles.length} files in logos directory`);
      
      // Copy each logo file
      for (const file of logoFiles) {
        const srcPath = path.join('public/only_these/logos', file);
        const destPath = path.join('.next/only_these/logos', file);
        console.log(`Copying ${srcPath} -> ${destPath}`);
        await fs.copy(srcPath, destPath, { overwrite: true });
      }
      console.log('Logo assets copied successfully!');
    } else {
      console.warn('Warning: logos directory not found in only_these folder!');
    }
    
    // Step 5: Also copy specific files to the root of .next
    const criticalFiles = [
      'firebase-messaging-sw.js',
      'manifest.json',
      'favicon.ico',
    ];
    
    for (const file of criticalFiles) {
      const srcPath = path.join('public', file);
      const destPath = path.join('.next', file);
      if (await fs.pathExists(srcPath)) {
        console.log(`Copying critical file ${srcPath} -> ${destPath}`);
        await fs.copy(srcPath, destPath, { overwrite: true });
      } else {
        console.warn(`Warning: Critical file ${file} not found in public folder!`);
      }
    }
    
    // Step 6: Create a special directory directly in .next to mirror /only_these
    await fs.ensureDir('.next/only_these');
    if (await fs.pathExists('public/only_these')) {
      await fs.copy('public/only_these', '.next/only_these', { 
        overwrite: true,
      });
      console.log('Created special only_these directory in .next root');
    }
    
    // Step 7: List files in .next/only_these to verify
    if (await fs.pathExists('.next/only_these')) {
      const copiedFiles = await fs.readdir('.next/only_these');
      console.log('Files in .next/only_these:', copiedFiles);
    }

    console.log('Assets prepared for Netlify deployment!');
  } catch (error) {
    console.error('Error preparing assets:', error);
    process.exit(1);
  }
}

main(); 