const Comment = require('../models/comment')
const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api';
const covidRootURL = 'https://api.covid19api.com/summary';
const token = process.env.GOOGLE_MAPS_TOKEN;

module.exports = {
    index,
    show
}

function index(req, res){
    if (!Object.keys(req.query).length) req.query.method = 'alphabetical';
    console.log(req.query)
    const options = {
        url: rootURL
    };
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        // Create an array from objects property values!
        let countriesArray = Object.values(dataBody.data);
        // Filter to not include any countries that have 0 sources
        let filteredCountries = countriesArray.filter(country => country.advisory.sources_active > 0);
        // Sort by score then return new array of the first 10
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

        res.render('countries/index', {title: 'All Countries', countriesArray, topCountries});
    })
}

function show(req, res){
    const countryCode = req.params.id
    const options = {
        url: `${rootURL}?countrycode=${countryCode}`
    }
    const covidOptions = {
        url: covidRootURL
    }
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        const country = dataBody.data[countryCode];
        request(covidOptions, function(err, response, body){
            const covidBody = JSON.parse(body);
            const covidCountry = covidBody.Countries.find(place => place.CountryCode === countryCode);
            console.log(covidCountry);
            Comment.find({countryCode: req.params.id}).populate('user').exec(function(err, comments){
                res.render('countries/show', {title: 'Specific Country', country, comments, token, covidCountry});
            });
        });
    });
}

