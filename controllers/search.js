const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api'

module.exports = {
    index
}

function index(req, res){
    const options = {
        url: rootURL
    };
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        let countriesArray = Object.values(dataBody.data);
        let searchedTerm = req.query.name;
        let searchResult = countriesArray.find(country => country.name === searchedTerm)
        console.log(searchResult);
        res.render('search/index', {title: 'All Countries', searchResult, searchedTerm});
    })
}