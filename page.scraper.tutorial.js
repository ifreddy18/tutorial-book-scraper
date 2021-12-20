let counter = 1;
const pageScraper = {
    url: null,
    setUrl( url ) { this.url = url },
    async scraper(browser, category = '') {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        
        // Navigate to the selected page
        await page.goto(this.url);
        let scrapedData = [];
        
        let selectedCategory;

        if ( category !== '' ) {
            selectedCategory = await page.$$eval('.side_categories > ul > li > ul > li > a', (links, _category) => {

                // Busca el unico elemento que coincida con el nombre de la categoria
                // Devuelve el elemento si tiene el nombre de la categoria y un null si no lo tiene
                links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);

                // Regresa el unico elemento que coindicio con el nombre de la categoria
                let link = links.filter(tx => tx !== null)[0];
                
                // Regresa el url de la pagina principal de dicha categoria
                return link.href;
            
            }, category);

            // Navigate to the selected category
            console.log('Navigating to category', selectedCategory);
            await page.goto(selectedCategory);

        }

        // Wait for the required DOM to be rendered
        async function scrapeCurrentPage() {
            await page.waitForSelector('.page_inner', {
                timeout: 30000
            })
            .catch( err => console.log('.page_inner not found') );
            
            await page.waitForSelector('.next > a', { 
                timeout: 10000,
            })
            .catch( err => console.log('Next button no found') );

            // Get the link to all the required books
            let urls = await page.$$eval('section ol > li', links => {
                // Make sure the book to be scraped is in stock
                links = links.filter(link => {
                    try {
                        return link.querySelector('.star-rating').classList.contains("Four")
                    } catch ( err ) {
                        return false;
                    }
                });
                // Extract the links from the data
                links = links.map(el => el.querySelector('h3 > a').href);
                return links;
            });

            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = ( link ) => new Promise(async (resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage();
                
                await newPage.goto(link);
                
                dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
                dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
                dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
                    // Strip new line and tab spaces
                    text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    // Get the number of stock available
                    let regexp = /^.*\((.*)\).*$/i;
                    let stockAvailable = regexp.exec(text)[1].split(' ')[0];
                    return stockAvailable;
                });
                dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
                dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
                dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
                
                resolve(dataObj);
                
                await newPage.close();
            
            });

            for (link in urls) {
                let currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
                // console.log(currentPageData);
            }

            console.log('Page:', counter );
            counter++;

            // When all the data on this page is done, click the next button and start the scraping of the next page
            // You are going to check if this button exist first, so you know if there really is a next page.
            let nextButtonExist = false;

            try {
                const nextButton = await page.$eval('.next > a', a => a.textContent);
                nextButtonExist = true;
            } catch (err) {
                nextButtonExist = false;
            }

            if (nextButtonExist) {
                await page.click('.next > a');
                return scrapeCurrentPage(); // Call this function recursively
            }

            await page.close();
            return scrapedData;
        
        }

        let data = await scrapeCurrentPage();

        return data;

    }
}

module.exports = { pageScraper };