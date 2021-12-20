// const { pageScraper } = require('./page.scraper');
const { pageScraper } = require('./page.scraper.tutorial');
const fs = require('fs');

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
        scrapedData['HistoricalFiction'] = await pageScraper.scraper(browser, 'Historical Fiction');
        scrapedData['Mystery'] = await pageScraper.scraper(browser, 'Mystery');
        
        await browser.close();
        
        // console.log(scrapedData);

        fs.writeFile("data.json", JSON.stringify(scrapedData), 'utf8', (err) => {
            if(err) {
                return console.log(err);
            }
            console.log("The data has been scraped and saved successfully! View it at './data.json'");
        });

    } catch ( err ) {
        console.log("Could not resolve the browser instance => ", err);
    }
};

module.exports = {
    scrapeAll
};