const express = require('express');

const CountryCache = require('../models/CountryCache');


const router = express.Router();

router.use(express.json({limit: '2mb'}));

// Get all Countries
router.get('/cases', async (req, res) => {
    res.json(await CountryCache.getCountries());
});

// Get specific Country
router.get('/cases/:country', async (req, res) => {
    try {
        const currentCountry = await CountryCache.getCountry(req.params.country.toUpperCase());

        res.json({ error: false, country: currentCountry });
    } catch (err) {
        res.json({ error: true, errorMsg: err });
    }
});

module.exports = {
    router: router,
};