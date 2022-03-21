const puppeteer = require('puppeteer'); // include puppeteer package to crawl page
const prompt = require('prompt-sync')(); // include propmpt package to ask user for site url

// include csv package to write result to an excel file.
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// csv ovject to specify path,headers, and to append result instead of rewrite
const csvWriter = createCsvWriter({
    path: './keywords.csv',
    append:true,
    header: [
        {id: 'siteURl', title: 'siteURl'},
        {id: 'keywords', title: 'keywords'},
        
       
    ]
    
    
});
const siteName = prompt('What is the site url?'); // prompt user for site url to crawl

// To use await we wrap our code in an async function
async function scrape() {
    // Create the browser without headless mode
    const browser = await puppeteer.launch({ headless: false });

    // create a tab or page
    const page = await browser.newPage();

    // Navigate to a website entered by user
    await page.goto(
        `${siteName}`
    );

    // returns meta tags with name keywords and save to variable keywords.

    const keywords=await page.evaluate(() =>{
      
        return document.querySelector('meta[name="keywords"]').content;
   
    })

    
//assign site name and fetched keywords to records
    const records = [

    
    {siteURl:`${siteName}` ,keywords: `${keywords}`},
];
 
 // write to csv file 
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...keywords scraped successfully');
    });
 
    // Close the browser
    await browser.close();
}

// Run our function
scrape().catch(console.error);

