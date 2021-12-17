// const { pageScraper } = require('./page.scraper');
const { pageScraper } = require('./page.scraper.tutorial');


const scrapeAll = async( browserInstace, url ) => {

    let browser;

    try {
        
        browser = await browserInstace;

        pageScraper.setUrl( url );
        await pageScraper.scraper( browser );

    } catch ( err ) {
        console.log("Could not resolve the browser instance => ", err);
    }
};

module.exports = {
    scrapeAll
};