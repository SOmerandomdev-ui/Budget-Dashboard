const express = require("express")
const cors = require('cors');
const puppeteer = require('puppeteer')
const app = express() 

app.use(cors());
app.use(express.json());

app.post("/api/upload", async (req, res) => {
    let namelist = []
    for (item of req.body) {
        namelist.push(item.description)
    }
    await ScrapeWeb(namelist) 
    res.json({ success: true })
})

async function ScrapeWeb(Names) {
    //Store the actual names
    const NameList = []
    //Launch a browser and a page 
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage()

    //go to the URL and get the input that corresponds to the search 
    await page.goto("https://www.whatsthatcharge.com/")
    const search = await page.$("input[name='q']")

    await search.click()

    //iterate through each item, type it into the search, and press enter
    for (let item of Names) {
        await search.type(item)
        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press("Enter"),
        ])
        const tmp = await page.content() 
        console.log(tmp)
    }

    
}

app.listen(3000, () => console.log("goon"))