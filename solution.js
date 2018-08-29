const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

var url = 'https://m.bnizona.com/index.php/category/index/promo'
var json = {};
promoScrap(url);

function promoScrap(url) {
    request(url, function (err, res, body) {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body);
        var category;
        $('.menu li a').each((i, value) => {
            category = $(value).text();
            json[category] = [];
            var urlcategory = $(value).attr('href');
            categoryScrap(urlcategory, category);
        });
    });    
}

function categoryScrap(urlcategory, category) {
    request(urlcategory, function (err, res, body) {
        if (err && res.statusCode !== 200) throw err;
        let $ = cheerio.load(body);
        var title, imageurl, merchant, validuntil;
        $('.list2 li a').each((i, value) => {
            title = $(value).children('span[class=promo-title]').text();
            imageurl = $(value).children('img').attr('src');
            merchant = $(value).children('span[class=merchant-name]').text();
            validuntil = $(value).children('span[class=valid-until]').text();
            validuntil = validuntil.replace("valid until ","");
            json[category].push({
                "title": title,
                "imageurl": imageurl,
                "merchant": merchant,
                "validuntil": validuntil
            });
        });
        createJson(json);
    });
}

function createJson(json) {
    fs.writeFile('solution.json', JSON.stringify(json, null, 4), function(err){
        console.log('File successfully written!');
    })
}