import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
const { Eyes, Target } = require('@applitools/eyes-puppeteer');

export default async (req, res) => {
  const body = JSON.parse(req.body) || {};
  const { url, apiKey, type = 'capture' } = body;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true
  });

  const page = await browser.newPage();

  const eyes = new Eyes();

  eyes.setApiKey(apiKey);

  let results;

  try {
    await eyes.open(page, 'Applitools Preview', 'Puppeteer Headless');

    // Navigate the browser to the "ACME" demo app.

    await page.goto(url);

    if ( type === 'chaos' ) {
      await page.evaluate(() => {
        document.querySelectorAll('div').forEach(el => el.style.paddingLeft = '20px')
      });
    }

    // Visual checkpoint #1 - Check the login page.

    await eyes.check("Login Window", Target.window());

    // End the test.

    results = await eyes.close(false);

    await browser.close();
  } catch(e) {
    return res.status(400).json({
      error: e.message
    })
  }

  res.status(200).json({ results });
}