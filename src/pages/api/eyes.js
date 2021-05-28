const { chromium } = require('playwright');
const { Eyes, ClassicRunner, Target, RectangleSize, Configuration, BatchInfo} = require('@applitools/eyes-playwright');

export default async (req, res) => {
  const body = JSON.parse(req.body) || {};
  const { url, apiKey } = body;

  const browser = await chromium.launch()
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Initialize the Runner for your test.

  const runner = new ClassicRunner();

  // Initialize the eyes SDK (IMPORTANT: make sure your API key is set in the APPLITOOLS_API_KEY env variable).

  const eyes = new Eyes(runner);

  // Initialize the eyes configuration.

  const conf = new Configuration()

  // set new batch

  conf.setBatch(new BatchInfo('Eyes Batch'));

  // set the configuration to eyes

  eyes.setConfiguration(conf)

  eyes.setApiKey(apiKey);

  try {

    await eyes.open(page, 'Applitools Preview', 'Playwright Headless', new RectangleSize(800, 600));

    // Navigate the browser to the "ACME" demo app.
    
    await page.goto(url);

    // Visual checkpoint #1 - Check the login page.
    
    await eyes.check("Login Window", Target.window().fully());

    // End the test.
    
    await eyes.closeAsync();

    await browser.close()
    
    // If the test was aborted before eyes.close was called, ends the test as aborted.
    
    await eyes.abortIfNotClosed();
  } catch(e) {
    res.status(400).json({
      error: e.message
    })
  }

  // Wait and collect all test results

  const results = await runner.getAllTestResults(false);

  res.status(200).json({ results })
}
