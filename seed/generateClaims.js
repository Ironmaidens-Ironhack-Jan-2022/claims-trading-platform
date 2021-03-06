require("./../db/index");
const axios = require("axios");
const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const Chance = require("chance");
const isPast = require("date-fns/isPast");
const chance = new Chance();
let maturityRangeStart, maturityRangeEnd;

async function generateClaims(numberOfClaims) {
    const claims = [];
    let object = {};
    for (let i = 0; i < numberOfClaims; i++) {
        let { claimType, debtor } = await getRandomTypeAndDebtor();
        object = {};
        object.maturity = await getRandomDate(claimType);
        object.performance = getRandomPerformance(object.maturity);
        object.debtor = debtor;
        object.claimType = claimType;
        object.debtorLocation = chance.country({full: true});
        object.faceValue = getFaceValue(claimType);
        object.currency = await getCurrency(object.debtorLocation) || "USD";
        object.minimumPrice = getRandomMinimumPrice(object.performance);
        claims.push(object);
    }
    return claims;
}

async function getRandomTypeAndDebtor(){
    const claimTypes = ['Corporate Loan', 'Consumer Debt', 'Retail Mortgage', 'Commercial Real Estate Loan', 'Trade Claim'];
    let claimType, debtor;
    const randomIndex = Math.floor(Math.random()*claimTypes.length);
    claimType = claimTypes[randomIndex];
    switch(claimType) {
        case "Corporate Loan":
        case "Commercial Real Estate Loan": 
        case "Trade Claim":
            debtor = chance.company();
            break;
        case "Consumer Debt":
        case "Retail Mortgage":
            debtor = chance.name();
    }
    return { claimType, debtor };
}

async function getCurrency (debtorCountry) {
    let currency;
    const response = await axios.get("https://gist.githubusercontent.com/tiagodealmeida/0b97ccf117252d742dddf098bc6cc58a/raw/f621703926fc13be4f618fb4a058d0454177cceb/countries.json");
    const countriesArray = response.data.countries.country;
    countriesArray.forEach(country => {
        if (country.countryName === debtorCountry) currency = country.currencyCode;
    })
    return currency;
}

function getFaceValue(claimType) {

    let min, range, roundedTo;

    switch(claimType) {
        case "Corporate Loan":
            min = 10000;
            range = 50000000;
            break;
        case "Consumer Debt":
            min = 100;
            range = 10000;
            break;
        case "Retail Mortgage":
            min = 50000;
            range = 1000000;
            break;
        case "Commercial Real Estate Loan":
            min = 100000;
            range = 100000000;
            break;
        case "Trade Claim":
            min= 100;
            range = 1000000;
            break;
        default:
            min = 1000;
            range = 1000000;
            break;
    }

    const randomValue = (Math.random()*range) + min;

    if (randomValue < 1000) {
        roundedTo = 10;
    } else if (randomValue >= 1000 && randomValue < 10000) {
        roundedTo = 100;
    } else if (randomValue >= 10000 && randomValue < 100000) {
        roundedTo = 1000;
    } else if (randomValue >= 100000 && randomValue < 1000000) {
        roundedTo = 10000;
    } else if (randomValue >= 1000000 && randomValue < 10000000) {
        roundedTo = 100000;
    } else if (randomValue >= 10000000 && randomValue < 100000000) {
        roundedTo = 1000000;
    } else if (randomValue >= 100000000) {
        roundedTo = 10000000;
    }

    faceValue = (Math.floor((randomValue / roundedTo)))*roundedTo;

    return faceValue;
}

function getRandomDate(claimType) {

    switch(claimType) {
        case "Corporate Loan":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2032-12-31";
            break;
        case "Consumer Debt":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2027-12-31";
            break;
        case "Retail Mortgage":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2035-12-31";
            break;
        case "Commercial Real Estate Loan":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2045-12-31";
            break;
        case "Trade Claim":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2025-12-31";
            break;
        default:
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2030-12-31";
            break;
    }

    maturityRangeStart = Date.parse(maturityRangeStart);
    maturityRangeEnd = Date.parse(maturityRangeEnd);
    return new Date(Math.floor(Math.random() * (maturityRangeEnd - maturityRangeStart + 1) + maturityRangeStart));
}

function getRandomPerformance(maturity) {
    if (isPast(maturity)) return "Defaulted";
    const performanceTypes = ['Performing', 'Defaulted', 'Stressed'];
    const randomIndex = Math.floor(Math.random()*performanceTypes.length);
    const performance = performanceTypes[randomIndex];
    return performance;
}

function getRandomMinimumPrice(performance) {
    let min, range;
    const roundedTo = 5;
    switch(performance) {
        case "Performing":
            min = 85;
            range = 15;
            break;
        case "Stressed":
            min = 35;
            range = 50;
            break;
        case "Defaulted":
            min = 1;
            range = 35;
            break;
        default:
            min = 40;
            range = 40;
            break;
    }
    let randomPrice = (Math.random()*range) + min;
    if (randomPrice <= 5 || randomPrice >= 95) {
        randomPrice = Math.round(randomPrice);
    } else if (randomPrice > 5 || randomPrice < 95) {
        randomPrice = (Math.floor((randomPrice / roundedTo)))*roundedTo;
    }

    return randomPrice;
}

module.exports = generateClaims;



