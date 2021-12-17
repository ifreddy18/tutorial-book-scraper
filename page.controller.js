// const { pageScraper } = require('./page.scraper');
const { pageScraper } = require('./page.scraper.tutorial');


const scrapeAll = async( browserInstace, url ) => {

    let browser;

    try {
        
        browser = await browserInstace;

        pageScraper.setUrl( url );

        // Scraper sin categoria
        // await pageScraper.scraper( browser );

        // Call the scraper for different set of books to be scraped
        let scrapedData = {};
        scrapedData['Travel'] = await pageScraper.scraper(browser, 'Travel');
        await browser.close();
        console.log(scrapedData)

    } catch ( err ) {
        console.log("Could not resolve the browser instance => ", err);
    }
};

module.exports = {
    scrapeAll
};