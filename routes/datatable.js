var express = require('express');
const pool = require('../db/db')
const fs = require("fs");
var format = require('pg-format');
var router = express.Router();

// var count = 0;
var count = fs.readFile("landmarks.json", "utf-8", (err, data) => {
    if (err) throw err;
    count = JSON.parse(data).length;
    console.log(count);
    return count;
});


const downloadSelect = `SELECT landmark.landmarkId,landmarkName,century,type,height,
artStyle,city.cityName,country.countryName,
	(SELECT array_to_json(array_agg(row_to_json(names)))
	 FROM ((SELECT architect.architectName, architect.architectSurname
	 	FROM architect
	 	LEFT JOIN landmarkArch ON landmarkArch.architectId = architect.architectId
	 	WHERE landmarkArch.landmarkId = landmark.landmarkId
	)) names) AS architectNames
FROM landmark
LEFT JOIN city ON landmark.cityName = city.cityName
LEFT JOIN country ON city.countryName = country.countryName`;

const displaySelect = `SELECT landmark.landmarkId,landmarkName,century,type,height,
artStyle,city.cityName,country.countryName,architect.architectName,architectSurname
FROM landmark
LEFT JOIN city ON landmark.cityName = city.cityName
LEFT JOIN country ON city.countryName = country.countryName
LEFT JOIN landmarkArch ON landmarkArch.landmarkId = landmark.landmarkId
LEFT JOIN architect ON  architect.architectId = landmarkArch.architectId`;

// putanje za saveanje filtriranih fileova
const jsonPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/landmarks.json';
const csvPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/landmarks.csv';

// za prikaz podataka
const attributes = ['landmarkid','landmarkname','century','type','height',
'artstyle','cityname','countryname','architectname','architectsurname'];
const attributes2 = [{display: 'Id', sql: 'landmarkid'},
                    {display: 'Naziv', sql: 'landmarkname'},
                    {display: 'Stoljeće', sql: 'century'},
                    {display: 'Tip', sql: 'type'},
                    {display: 'Visina', sql: 'height'},
                    {display: 'Umjetnički stil', sql: 'artstyle'},
                    {display: 'Grad', sql: 'cityname'},
                    {display: 'Država', sql: 'countryname'},
                    {display: 'Ime Arhitekta', sql: 'architectname'},
                    {display: 'Prezime Arhitekta', sql: 'architectsurname'}
                    ];


router.get('/',async (req,res) => {
    var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`, downloadSelect, jsonPath);
    var csv = format(`COPY (%s) TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect, csvPath);
    await pool.query(json);
    await pool.query(csv);
    const results = await pool.query(displaySelect);
    // promjena original fileova u slucaju updateanja baze

    res.render('datatable', {
        title: 'Data',
        rows: results.rows,
        attributes: attributes,
        attributes2: attributes2
    });
});

router.post('/',async (req,res) => {
    const searchattr = req.body.searchattr;
    /*
    // nisu postavljeni nikakvi parametri
    if (!req.body.searchterm && !req.body.searchattr) {
        var sqlic = displaySelect;
        var result = await pool.query(sqlic);

        var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`, downloadSelect, jsonPath);
        var csv = format(`COPY (%s) TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect, csvPath);
        
        
    } else if (!req.body.searchattr) {

    } else {

    }
    */
    await pool.query(json);
    await pool.query(csv);
    
    const results = result;

    res.render('datatable', {
        rows: results.rows,
        attributes: attributes,
        attributes2: attributes2
    });
});

module.exports = router;
