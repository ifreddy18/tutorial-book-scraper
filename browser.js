const puppeteer = require('puppeteer');

// Esta función iniciará el navegador y devolverá una instancia de él
const startBrowser = async() => {

    let browser;

    try {
        
        console.log('Opening the browser......');
        
        browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            args: ['--disable-setuid-sandbox'],
        });

    } catch (err) {
        console.log('Could not create a browser instance => : ', err);
    }

    return browser;

};

module.exports = {
    startBrowser,
}
