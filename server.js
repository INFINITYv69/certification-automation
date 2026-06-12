const express = require('express');
const fs = require('fs');
const path = require('path');

// Determine if we are running in a serverless environment (Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_REGION;

let puppeteer;
let chromium;

if (isServerless) {
  puppeteer = require('puppeteer-core');
  chromium = require('@sparticuz/chromium');
} else {
  puppeteer = require('puppeteer');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load the certificate HTML template once at startup
const templatePath = path.join(__dirname, 'templates', 'certificate_template.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

// Serve the form
app.get('/', (req, res) => {
  res.sendFile = res.sendFile.bind(res);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate certificate PDF
app.post('/generate', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Sanitize: escape any HTML special characters to prevent injection
    const safeName = name
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Inject the participant's name into the template
    let filledHtml = templateHtml.replace('[RECIPIENT NAME]', safeName);

    // Remove the on-screen control panel (editing instructions) for the final PDF
    filledHtml = filledHtml.replace(
      /<div class="control-panel">[\s\S]*?<\/div>/,
      ''
    );

    // Render to PDF using Puppeteer
    let browser;
    if (isServerless) {
      // Serverless (Vercel) configuration
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Local development configuration
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
    }
    const page = await browser.newPage();

    await page.setContent(filledHtml, { waitUntil: 'networkidle0' });

    // Give the canvas watermark script time to draw
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' }
    });

    await browser.close();

    const fileName = `Corsair_CTF_Certificate_${safeName.replace(/\s+/g, '_')}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating certificate:', err);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

app.listen(PORT, () => {
  console.log(`Certificate generator running at http://localhost:${PORT}`);
});
