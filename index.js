const { startBrowser } = require('./browser');
const { scrapeAll } = require('./page.controller');

const url = 'http://books.toscrape.com/';

// Start the browser and create browser instance
let browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
scrapeAll( browserInstance, url);


