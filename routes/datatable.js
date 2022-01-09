var express = require('express');
const pool = require('../db/db')
const fs = require("fs");
var format = require('pg-format');
var router = express.Router();

var count = fs.readFile("./public/landmarks/landmarks.json", "utf-8", (err, data) => {
    if (err) throw err;
    count = JSON.parse(data).length;
    console.log(count);
    return count;
});
const architectsSelect = `SELECT array_to_json(array_agg(row_to_json(architects)))
FROM (SELECT architect.architectName, architect.architectSurname
    FROM architect
    LEFT JOIN landmarkArch ON landmarkArch.architectId = architect.architectId
    WHERE landmarkArch.landmarkId = landmark.landmarkId
) architects`;

const downloadSelect = `SELECT landmark.landmarkId,landmarkName,century,type,height,
artStyle,city.cityName,country.countryName,
	(SELECT array_to_json(array_agg(row_to_json(architects)))
	 FROM (SELECT architect.architectName, architect.architectSurname
	 	FROM architect
	 	LEFT JOIN landmarkArch ON landmarkArch.architectId = architect.architectId
	 	WHERE landmarkArch.landmarkId = landmark.landmarkId
	) architects) AS architects
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

const jsonPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/landmarks.json';
const csvPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/landmarks.csv';

const attributes = ['landmarkid','landmarkname','century','type','height',
'artstyle','cityname','countryname','architectname','architectsurname'];
const attributes2 = [{display: 'Id', sql: 'landmark.landmarkid'},
                    {display: 'Naziv', sql: 'landmarkname'},
                    {display: 'Stoljeće', sql: 'century'},
                    {display: 'Tip', sql: 'type'},
                    {display: 'Visina', sql: 'height'},
                    {display: 'Umjetnički stil', sql: 'artstyle'},
                    {display: 'Grad', sql: 'city.cityname'},
                    {display: 'Država', sql: 'country.countryname'},
                    {display: 'Ime Arhitekta', sql: 'architect.architectname'},
                    {display: 'Prezime Arhitekta', sql: 'architect.architectsurname'}
                    ];


router.get('/',async (req,res) => {
    var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) 
    to 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/landmarks/landmarks.json'`, downloadSelect);
    var csv = format(`COPY (%s) TO 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/landmarks/landmarks.csv'
     DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect);
    await pool.query(json);
    await pool.query(csv);
    const results = await pool.query(displaySelect);

    res.render('datatable', {
        title: 'Data',
        rows: results.rows,
        attributes: attributes,
        attributes2: attributes2,
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.post('/',async (req,res) => {
    const searchattr = req.body.searchattr;
    
    if (!req.body.searchterm && !req.body.searchattr) {
        var sqlic = displaySelect;
        var result = await pool.query(sqlic);

        var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`, downloadSelect, jsonPath);
        var csv = format(`COPY (%s) TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect, csvPath);
        
        
    } else if (!req.body.searchattr) {

        // broj
        if (!isNaN(req.body.searchterm)) {
            
            const searchterm = req.body.searchterm;
            let search = `landmark.landmarkid=$1 or landmark.height=$1
                            or landmark.century=$1`
            var sqlic = format(`%s WHERE %s `, displaySelect, search);
            var result = await pool.query(sqlic, [searchterm]);

            // json i csv
            var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks)))
                        FROM (%s 
                        WHERE landmark.landmarkid=%s
                        or landmark.height=%s or landmark.century=%s) landmarks)
                        to '%s'`,
                        downloadSelect, searchterm, searchterm, searchterm, jsonPath);
            var csv = format(`COPY (%s 
                        WHERE landmark.landmarkid=%s
                        or landmark.height=%s or landmark.century=%s)
                        TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`,
                        displaySelect, searchterm, searchterm, searchterm, csvPath);

        // rijec
        } else {
            
            const searchterm = '%' + req.body.searchterm.toLowerCase() + '%';
            let search = `LOWER(landmark.landmarkname) like $1 or LOWER(landmark.type) like $1 or LOWER(landmark.artstyle) like $1
                        or LOWER(city.cityname) like $1 or LOWER(country.countryname) like $1
                        or LOWER(architect.architectname) like $1 or LOWER(architect.architectsurname) like $1`;
            var sqlic = format(`%s WHERE %s`, displaySelect, search);
            var result = await pool.query(sqlic, [searchterm]);

            // json i csv
            var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks)))
                        FROM (%s 
                        WHERE LOWER(landmark.landmarkname) like '%s' or LOWER(landmark.type) like '%s'
                        or LOWER(landmark.artstyle) like '%s' or LOWER(city.cityname) like '%s'
                        or LOWER(country.countryname) like '%s' or
                        LOWER(((%s)::json -> 0) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 1) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 2) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 3) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 4) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 5) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 6) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 7) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 0) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 1) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 2) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 3) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 4) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 5) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 6) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 7) ->> 'architectsurname') like '%s' 
                        ) landmarks)
                        to '%s'`,
                        downloadSelect, searchterm, searchterm, searchterm, searchterm,searchterm,
                        architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,
                        architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,
                        jsonPath);
            console.log(json);
            var csv = format(`COPY (%s 
                        WHERE LOWER(landmark.landmarkname) like '%s' or LOWER(landmark.type) like '%s'
                        or LOWER(landmark.artstyle) like '%s' or LOWER(city.cityname) like '%s'
                        or LOWER(country.countryname) like '%s' or LOWER(architect.architectname) like '%s'
                        or LOWER(architect.architectsurname) like '%s')
                        TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`,
                        displaySelect, searchterm, searchterm, searchterm, searchterm, searchterm, searchterm, searchterm, csvPath);
        }
    } else {
        
        //atribut je broj
        console.log(searchattr)
        if (searchattr === "landmark.landmarkid" || searchattr === "height" || searchattr === "century") {

            const searchterm = req.body.searchterm;
            var sqlic = format(`%s WHERE %s=$1`, displaySelect, searchattr, searchattr);
            var result = await pool.query(sqlic, [searchterm]);

            var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks)))
                        FROM (%s 
                        WHERE %s=%s) landmarks)
                        to '%s'`,
                        downloadSelect, searchattr, searchterm, jsonPath);
            var csv = format(`COPY (%s 
                        WHERE %s=%s)
                        TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`,
                        displaySelect, searchattr, searchterm, csvPath);
        
        //atribut je rijec
        } else {
            
            const searchterm = '%' + req.body.searchterm.toLowerCase() + '%';
            var sqlic = format(`%s WHERE LOWER(%s) like LOWER('%s')`, displaySelect, searchattr, searchterm);
            var result = await pool.query(sqlic);

            // json i csv
            if (searchattr == 'architect.architectname') {
                console.log("dobro sm");
                var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks)))
                        FROM (%s 
                        WHERE 
                        LOWER(((%s)::json -> 0) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 1) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 2) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 3) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 4) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 5) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 6) ->> 'architectname') like '%s' or
                        LOWER(((%s)::json -> 7) ->> 'architectname') like '%s'
                        ) landmarks)
                        to '%s'`,
                        downloadSelect,
                        architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,
                        jsonPath);
            } else if (searchattr == 'architect.architectsurname') {

                var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks)))
                        FROM (%s 
                        WHERE 
                        LOWER(((%s)::json -> 0) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 1) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 2) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 3) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 4) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 5) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 6) ->> 'architectsurname') like '%s' or
                        LOWER(((%s)::json -> 7) ->> 'architectsurname') like '%s'
                        ) landmarks)
                        to '%s'`,
                        downloadSelect,
                        architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,architectsSelect, searchterm,
                        jsonPath);
            } else {
                var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks)))
                        FROM (%s 
                        WHERE LOWER(%s) LIKE '%s'
                        ) landmarks)
                        to '%s'`,
                        downloadSelect, searchattr, searchterm, jsonPath);
            }
            
            var csv = format(`COPY (%s 
                        WHERE LOWER(%s) LIKE '%s')
                        TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`,
                        displaySelect, searchattr, searchterm, csvPath);
        }
    }
    
    await pool.query(json);
    await pool.query(csv);
    
    const results = result;
    console.log(results.rows);
    console.table(results.rows);

    res.render('datatable', {
        title: 'Data',
        rows: results.rows,
        attributes: attributes,
        attributes2: attributes2,
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

module.exports = router;
