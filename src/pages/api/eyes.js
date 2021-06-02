import playwright from 'playwright';
const { Eyes, Target } = require('@applitools/eyes-playwright');

export default async (req, res) => {
  const body = JSON.parse(req.body) || {};
  const { url, apiKey } = body;

  // const executablePath = await chromium.executablePath;
  let browser;

  // if ( executablePath ) {
  //   browser = await playwright.chromium.launch({
  //     args: chromium.args,
  //     executablePath,
  //     headless: chromium.headless,
  //   });
  // } else {
    browser = await playwright.chromium.launch()
  // }

  const context = await browser.newContext();
  const page = await context.newPage();

  const eyes = new Eyes();

  eyes.setApiKey(apiKey);

  let results;

  try {
    await eyes.open(page, 'Applitools Preview', 'Playwright Headless');

    // Navigate the browser to the "ACME" demo app.
    
    await page.goto(url);

    // Visual checkpoint #1 - Check the login page.
    
    await eyes.check("Login Window", Target.window().fully());

    // End the test.
    
    results = await eyes.close();

    await browser.close();
  } catch(e) {
    return res.status(400).json({
      error: e.message
    })
  }

  res.status(200).json({
    results: {
      name: results.getName(),
      status: results.getStatus(),
      url: results.getUrl(),
      steps: results.getSteps(),
      matches: results.getMatches(),
      mismatches: results.getMismatches(),
      missing: results.getMissing(),
      hostDisplaySize: results.getHostDisplaySize()
    }
  });
}