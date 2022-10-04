import puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    const baseURL = 'https://www.zaproxy.org/docs/alerts'

    const browser = await puppeteer.launch({
        headless: false,
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
        const item = await page.evaluate(() => {
            const item = {}
            const title = document.querySelector('section > div > h1').innerText;
            if (title) {
                item.alert = title;
            }
            const summary = document.querySelector('[data-attr="summary"] > p');
            if (summary) {
                item.description = summary.innerText;
            }
            const solution = document.querySelector('[data-attr="solution"]');
            if (solution) {
                item.solution = solution.innerText.slice(9);
            }
            return item;
        });
        item.alertRef = id;
        items.push(item);
    }
    fs.writeFile('./data.json', JSON.stringify(items), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })

    await browser.close();
})();