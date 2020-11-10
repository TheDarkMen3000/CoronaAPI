import jsdom from 'jsdom';
import fetch from 'node-fetch';

import isoCodes from '../../resources/isoCodes';

const { JSDOM } = jsdom;

const UPDATE_DELAY = parseInt(process.env.UPDATE_DELAY as string) || 3600000;

interface Country {
    isoCode: string,
    country: string,
    totalCases: Number,
    currentCases: Number,
    recovered: Number,
    deaths: Number
};

interface lCountryList {
    [key: string]: Country,
    updatedAt?: any,
}

// Used to Cache the Country Data an refresh it after a certain time
class CountryCache {
    countries: lCountryList = {};

    constructor() {
        // Call at startup to load country data
        this.updateCountries();
    }

    // Get specific country
    async getCountry(isoCode: string) {
        // Check if Iso Code is in cache and if age is unter threshhold
        if (this.countries[isoCode] !== undefined || this.countries.updatedAt >= Date.now() - UPDATE_DELAY) {
            return this.countries[isoCode]; // Return cached value
        } else {
            // Get Countries from web
            await this.updateCountries();

            // Check if iso code exists in cache
            if (this.countries[isoCode]) {
                return this.countries[isoCode];
            } else {
                throw "Country Code " + isoCode + " not found"; // Error ISO-Code not in cache.
            }
        }
    }

    // Get all countries
    async getCountries() {
        let result: Array<Country> = [];

        // Check if data is loaded and if it is not to old
        if (this.countries === undefined || this.countries.updatedAt < Date.now() - UPDATE_DELAY) {
            await this.updateCountries();
        }

        // Get ISO-Codes of cache
        let isoCodes = Object.keys(this.countries);

        // Format data from object to array
        for (let i = 0; i < isoCodes.length; i++) {
            if (isoCodes[i] === 'updatedAt') continue;
            result.push({
                isoCode:      this.countries[isoCodes[i]].isoCode, 
                country:      this.countries[isoCodes[i]].country,
                totalCases:   this.countries[isoCodes[i]].totalCases,
                currentCases: this.countries[isoCodes[i]].currentCases,
                recovered:    this.countries[isoCodes[i]].recovered,
                deaths:       this.countries[isoCodes[i]].deaths
            });
        }

        return result;
    }

    // Load data from website
    private async updateCountries() {
        this.countries = {};
        const response = await fetch('https://www.worldometers.info/coronavirus/'); // Fetch data from worldometers
        const text = await response.text(); // get the Text of the HTML

        // Convert to dom with jsdom
        const dom = new JSDOM(text);

        // Get the table of the data
        const table = dom.window.document.getElementById('main_table_countries_today') as HTMLTableElement;

        if (table === null) {
            throw "No data found";
        }

        const rows = table.rows;

        // Loop at rows
        for (let i = 9; i < rows.length - 8; i++)
        {
            const columns = rows[i].cells;

            // Get ISO-Code
            let isoCode = isoCodes.filter(data => data.country == columns[1].textContent);

            if (isoCode.length === 0)
            {
                isoCode = [ { isoCode: 'NULL', country: 'NULL' } ];
            }

            this.countries[isoCode[0].isoCode] = {
                isoCode: isoCode[0].isoCode,
                country: columns[1].textContent as string,
                totalCases: parseInt(columns[2].textContent as string),
                currentCases: parseInt(columns[8].textContent as string),
                recovered: parseInt(columns[6].textContent as string),
                deaths: parseInt(columns[4].textContent as string)
            };
        }

        // Set updatedAt to the current time
        this.countries.updatedAt = Date.now();
    }
}

export default new CountryCache();
