const puppeteer = require('puppeteer');
const fs = require('fs');

function createJSONFile(data) {
    fs.writeFileSync('alerts.json', JSON.stringify(data));
}

(async () => {
    const baseURL = 'https://www.zaproxy.org/docs/alerts'

    const browser = await puppeteer.launch({
        // headless: false,
    });
    
    const page = await browser.newPage();

    await page.goto(baseURL);

    const ids = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td:first-child'));
        return tds.map(td => td.innerText);
    });

    const items = []
    for (const id of ids) {
        await page.goto(`${baseURL}/${id}`);
        item = await page.evaluate(() => {
            const item = {}
            //h1 class class="text--white"

            const title = document.querySelector('section > div > h1').innerText;
            item.title = title;
            const summary = document.querySelector('[data-attr="summary"] > p');
            if (summary){
                item.summary = summary.innerText;
            }
            const solution = document.querySelector('[data-attr="solution"]');
            if (solution){
                item.solution = solution.innerText.slice(9);
            }
            return item;
        });
        item.alertId = id;
        items.push(item);
    }
    createJSONFile(items)     
    await browser.close();
})();