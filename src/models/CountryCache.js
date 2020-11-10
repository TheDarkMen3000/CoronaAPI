const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const isoCodes = require('../../resources/isoCodes.json');

// Used to Cache the Country Data an refresh it after a certain time
const CountryCache = (() => {
    let countries = {};

    // Call at startup to load country data
    updateCountries();

    // Get specific country
    async function getCountry(isoCode) {
        // Check if Iso Code is in cache and if age is unter threshhold
        if (countries[isoCode] | countries.updatedAt >= Date.now() - 5000) {
            return countries[isoCode]; // Return cached value
        } else {
            // Get Countries from web
            await updateCountries();

            // Check if iso code exists in cache
            if (countries[isoCode]) {
                return countries[isoCode];
            } else {
                throw "Country Code " + isoCode + " not found"; // Error ISO-Code not in cache.
            }
        }
    }

    // Get all countries
    async function getCountries() {
        let result = [];

        // Check if data is loaded and if it is not to old
        if (countries === {} | countries.updatedAt < Date.now() - 5000) {
            await updateCountries();
        }

        // Get ISO-Codes of cache
        let isoCodes = Object.keys(countries);

        // Format data from object to array
        for (let i = 0; i < isoCodes.length; i++) {
            if (isoCodes[i] === 'updatedAt') continue;
            result.push({
                isoCode:      isoCodes[i], 
                country:      countries[isoCodes[i]].country,
                totalCases:   countries[isoCodes[i]].totalCases,
                currentCases: countries[isoCodes[i]].currentCases,
                recovered:    countries[isoCodes[i]].recoverd,
                deaths:       countries[isoCodes[i]].deaths
            });
        }

        return result;
    }

    // Load data from website
    async function updateCountries() {
        countries = {};
        const response = await fetch('https://www.worldometers.info/coronavirus/'); // Fetch data from worldometers
        const text = await response.text(); // get the Text of the HTML

        // Convert to dom with jsdom
        const dom = new JSDOM(text);

        // Get the table of the data
        const table = dom.window.document.getElementById('main_table_countries_today');

        const rows = table.rows;

        // Loop at rows
        for (let i = 9; i < rows.length - 8; i++)
        {
            const columns = rows[i].cells;

            // Get ISO-Code
            let isoCode = isoCodes.filter(data => data.Country == columns[1].textContent);

            if (isoCode.length === 0)
            {
                isoCode = [ { IsoCode: 'NULL' } ];
            }

            countries[isoCode[0].IsoCode] = {
                country: columns[1].textContent,
                totalCases: parseInt(columns[2].textContent),
                currentCases: parseInt(columns[8].textContent),
                recoverd: parseInt(columns[6].textContent.replace(/,/g, '')),
                deaths: parseInt(columns[4].textContent.replace(/,/g, ''))
            };
        }

        // Set updatedAt to the current time
        countries.updatedAt = Date.now();
    }


    return {
        getCountries: getCountries,
        getCountry: getCountry
    };
})();

module.exports = CountryCache;
