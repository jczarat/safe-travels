const Country = require('../models/country')
const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api'

module.exports = {
    index,
    show
}

function index(req, res){
    const options = {
        url: rootURL
    };
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        const countries = dataBody.data;
        res.render('countries/index', {title: 'All Countries', countries});
    })
}

function show(req, res){
    const countryCode = req.params.id

    const options = {
        url: `${rootURL}?countrycode=${countryCode}`
    }
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        const country = dataBody.data[countryCode];
        res.render('countries/show', {title: 'Specific Country', country});
    })
}