const Comment = require('../models/comment');
const request = require('request');
const numeral = require('numeral');
const rootURL = 'https://www.travel-advisory.info/api';
const covidRootURL = 'https://api.covid19api.com/summary';
const flagRootURL = 'https://restcountries.eu/rest/v2/all'
const token = process.env.GOOGLE_MAPS_TOKEN;

module.exports = {
    index,
    show
}

function index(req, res) {
    if (!Object.keys(req.query).length) req.query.method = 'alphabetical';
    const options = {
        url: rootURL
    };
    request(options, function (err, response, body) {
        const dataBody = JSON.parse(body);
        let countriesArray = Object.values(dataBody.data);
        let filteredCountries = countriesArray.filter(country => country.advisory.sources_active > 0);
        let topCountries = filteredCountries.sort((a, b) => a.advisory.score - b.advisory.score).splice(0, 10);
        const sortingMethods = {
            alphabetical: (a, b) => a.name.localeCompare(b.name),
            continent: (a, b) => a.continent.localeCompare(b.continent),
            countryCode: (a, b) => a.iso_alpha2.localeCompare(b.iso_alpha2),
            advisoryScore: (a, b) => a.advisory.score - b.advisory.score
        }
        if (req.query.method === 'advisoryScore') {
            countriesArray = countriesArray.filter(country => country.advisory.sources_active > 0);
            countriesArray.sort(sortingMethods[req.query.method]);
        } else {
            countriesArray.sort(sortingMethods[req.query.method]);
        }
        res.render('countries/index', { title: 'All Countries', countriesArray, topCountries });
    });
}

function show(req, res) {
    const countryCode = req.params.id
    const options = {
        url: `${rootURL}?countrycode=${countryCode}`
    }
    const covidOptions = {
        url: covidRootURL
    }
    const flagOptions = {
        url: flagRootURL
    }
    request(options, function (err, response, body) {
        const dataBody = JSON.parse(body);
        const country = dataBody.data[countryCode];
        request(covidOptions, function (err, response, body) {
            const covidBody = JSON.parse(body);
            const covidCountry = covidBody.Countries.find(place => place.CountryCode === countryCode);
            request(flagOptions, function (err, response, body) {
                const flagBody = JSON.parse(body);
                const flagCountry = flagBody.find(flag => flag.alpha2Code === countryCode);
                Comment.find({ countryCode: countryCode }).populate('user').exec(function (err, comments) {
                    res.render('countries/show', { title: 'Specific Country', country, covidCountry, flagCountry, comments, token, numeral });
                })
            });
        });
    });
}

