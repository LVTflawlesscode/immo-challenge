const sanitizeHtml = require('sanitize-html');
const puppeteer = require("puppeteer");
var fs = require("fs");

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  await page.exposeFunction('sanitizeHtml', (text) => sanitizeHtml(text));
  const items = await page.evaluate(async () => {
    // write your querySelectors here
    const descriptionElement = document.querySelector("#description");
    const description = descriptionElement != null ? await sanitizeHtml(descriptionElement.innerHTML) : null;
    const titleElement = document.querySelector("#detail-description-container > h2");
    const title = titleElement != null ? await sanitizeHtml(titleElement.innerHTML) : null;
    const priceElement = document.querySelector("#detail-title > div.price");
    const price = priceElement != null ? await sanitizeHtml(priceElement.innerHTML) : null;
    const addressElement = document.querySelector("#detail-title > div.address");
    const address = addressElement != null ? await sanitizeHtml(addressElement.innerHTML) : null;

    return {
      description,
      title,
      price,
      address,
    };
  });

  console.log(items);

  await browser.close();

  return items;
};

main().then((data) => {
  console.log(data);
  fs.writeFile("data.json", JSON.stringify(data), function (err) {
    if (err) {
      console.log(err);
    }
  });
});