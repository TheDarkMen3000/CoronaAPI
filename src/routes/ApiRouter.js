const express = require('express');
const fetch = require('node-fetch');
const jsdom = require('jsdom');

const isoCodes = require('../../resources/isoCodes.json');

const { JSDOM } = jsdom;

const router = express.Router();

var countries = [];

router.use(express.json({limit: '2mb'}));

router.get('/cases', (req, res) => {
    res.json(countries);
});

router.get('/cases/:country', (req, res) => {
    let response = {};

    const currentCountry = countries.filter((data) => data.isoCode.toLowerCase() == req.params.country);

    if (currentCountry.length == 0)
    {
        response.error = true;
        response.errorMsg = `No country found with ISO code ${req.params.country.toUpperCase()}.`
    }
    else
    {
        response = currentCountry[0];
    }

    res.json(response);
});

async function getData()
{
    const response = await fetch('https://www.worldometers.info/coronavirus/');
    const text = await response.text();

    try
    {
        const dom = new JSDOM(text);

        const table = dom.window.document.getElementById('main_table_countries_today');
        
        const rows = table.rows;

        for (let i = 9; i < rows.length - 8; i++)
        {
            const columns = rows[i].cells;

            let isoCode = isoCodes.filter(data => data.Country == columns[1].textContent);

            if (isoCode.length === 0)
            {
                isoCode = [ { IsoCode: 'NULL' } ];
            }

            countries.push({
                isoCode: isoCode[0].IsoCode,
                country: columns[1].textContent,
                totalCases: parseInt(columns[2].textContent.replace(/,/g, '')),
                currentCases: parseInt(columns[8].textContent.replace(/,/g, '')),
                recovered: parseInt(columns[6].textContent.replace(/,/g, '')),
                deaths: parseInt(columns[4].textContent.replace(/,/g, ''))
            });
        }
    }
    catch (e)
    {
        console.log(e);
    }
}

module.exports = {
    router: router,
    getData: getData
};