var express = require('express');
const pool = require('../db/db')
const fs = require("fs");
var format = require('pg-format');
var router = express.Router();
router.use(express.json());

const apiPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/api.json';
const jsonPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/landmarks.json';
const csvPath = 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/data/landmarks.csv';

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

async function checkId(id, method, res){
    var ids = (await pool.query(`SELECT landmarkid FROM landmark`)).rows;

    if (isNaN(id)){
        res.set({
            'method':method,
            'status':'400 Bad Request',
            'message':'The server cannot or will not process the request due to something that is perceived to be a client error.',
            'Content-type':'application/json'
        });

        let response = {
            'status':'400 Bad Request',
            'message':'The server cannot or will not process the request due to something that is perceived to be a client error.',
            'response':null
        };

        res.status(400).send(response);
    }

    let exists = false;
    for (var i = 0; i < ids.length; i++){
        if (id === ids[i].landmarkid.toString()) {
            exists = true;
            break;
        }
    }

    if (!exists){
        res.set({
            'method': 'GET',
            'status':'404 Not Found',
            'message':"The landmark with provided id doesn't exists.",
            'Content-type':'application/json'
        });

        let response = {
            'status':'404 Not Found',
            'message':"The landmark with provided id does'nt exists.",
            'response':null
        };

        res.status(404).send(response);
    }
}

// GET /api/znamenitosti
router.get('/',async(req,res) => {
    fs.readFile("./public/landmarks/landmarks.json","utf-8", function(err, data) {
        if (err)
            throw err;

        data = JSON.parse(data);

        let response = format (
            `{
                "status":"200 OK",
                "message":"Landmarks fetched.",
                "response": [
                    "@context": {
                        "@vocab": "https://schema.org/",
                        "landmarkname": "name",
                        "century": "century",
                        "type": "type",
                        "height": "height",
                        "artstyle": "artstyle",
                        "cityname": "https://schema.org/City",
                        "countryname": "https://schema.org/Country",
                        "architectname": "givenName",
                        "architectsurname": "familyName"
                    }, %s]
            }`
        ,data);
        
        res.set({
            'method': 'GET',
            "status":"200 OK",
            "message":"Landmarks fetched.",
            'Content-type':'application/json'
        });
    
        res.status(200).send(response);
    })
});

// GET /api/znamenitosti/gradovi
router.get('/gradovi',async(req,res) => {
    var data = (await (await pool.query(`SELECT cityname FROM city`))).rows;

    let response = format (
        `{
            "status":"200 OK",
            "message":"Cities have been fetched.",
            "response": [
                "@context": {
                    "@vocab": "https://schema.org/City",
                    "cityname": "name",
                }, %s]
        }`
    ,data);
    
    res.set({
        'method': 'GET',
        "status":"200 OK",
        "message":"Cities have been fetched.",
        'Content-type':'application/json'
    });

    res.status(200).send(response);
});

// GET /api/znamenitosti/drzave
router.get('/drzave',async(req,res) => {
    var data = (await (await pool.query(`SELECT countryname FROM country`))).rows;

    let response = format (
        `{
            "status":"200 OK",
            "message":"Countries has been fetched.",
            "response": [
                "@context": {
                    "@vocab": "https://schema.org/Country",
                    "countryname": "name",
                },%s]
        }`
    ,data);
    
    res.set({
        'method': 'GET',
        "status":"200 OK",
        "message":"Countries have been fetched.",
        'Content-type':'application/json'
    });

    res.status(200).send(response);
});

// GET /api/znamenitosti/arhitekti
router.get('/arhitekti',async(req,res) => {
    var data = (await (await pool.query(`SELECT architectname, architectsurname FROM architect`))).rows;

    let response = format (
        `{
            "status":"200 OK",
            "message":"Architects have been fetched.",
            "response": [
                "@context": {
                    "@vocab": "https://schema.org/Person",
                    "architectname": "givenName",
                    "architectsurname": "familyName",
                }, %s]
        }`
    ,data);
    
    res.set({
        'method': 'GET',
        "status":"200 OK",
        "message":"Architects have been fetched.",
        'Content-type':'application/json'
    });

    res.status(200).send(response);
});

// GET /api/znamenitosti/openapi
router.get('/openapi',async(req,res) => {
    fs.readFile("OpenAPI.json","utf-8", function(err, data) {
        if (err)
            throw err;

        data = JSON.parse(data);

        let response = format (
            `{
                "status":"200 OK",
                "message":"The OpenAPI specification has been fetched.",
                "response": [
                    "@context": {
                        "@vocab": "https://schema.org/",
                        "landmarkname": "name",
                        "century": "century",
                        "type": "type",
                        "height": "height",
                        "artstyle": "artstyle",
                        "cityname": "https://schema.org/City",
                        "countryname": "https://schema.org/Country",
                        "architectname": "givenName",
                        "architectsurname": "familyName"
                    }, %s]
            }`
        ,data);
        
        res.set({
            'method': 'GET',
            "status":"200 OK",
            "message":"The OpenAPI specification has been fetched.",
            'Content-type':'application/json'
        });
    
        res.status(200).send(response);
    })
});

// GET /api/znamenitosti/:id
router.get('/:id',async(req,res) => {
    const id = req.params.id;

    checkId(id, req.method, res);

    var sqlic = format(`%s WHERE landmarkid=%s`,downloadSelect, id);
    var api = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`,sqlic,apiPath);
    await pool.query(api);

    fs.readFile("./public/data/api.json","utf-8", function(err, data) {
        if (err)
            throw err;

        data = JSON.parse(data);

        let response = format (
            `{
                "status":"200 OK",
                "message":"The landmark with id = %s has been fetched.",
                "response": [
                    "@context": {
                        "@vocab": "https://schema.org/",
                        "landmarkname": "name",
                        "century": "century",
                        "type": "type",
                        "height": "height",
                        "artstyle": "artstyle",
                        "cityname": "https://schema.org/City",
                        "countryname": "https://schema.org/Country",
                        "architectname": "givenName",
                        "architectsurname": "familyName"
                    }, %s]
            }`
        ,id,data);
        
        res.set({
            'method': 'GET',
            'status':'200 OK',
            'message':'The resource has been fetched.',
            'Content-type':'application/json',
            'warning': 'with content type charset encoding will be added by default'
        });
    
        res.status(200).send(response);
    })

});
/*
za post dio
{
    "landmarkname": "Zagreb Cathedral",
    "century": 13,
    "type": "Cathedral",
    "height": 108,
    "artstyle": "gothic",
    "cityname": "Zagreb",
    "countryname": "Croatia",
    "architectname": "Hermann",
    "architectsurname": "Bollé"
}
*/
// POST /api/znamenitosti
router.post('/',async(req,res) => {
    var maxIdBefore = (await pool.query(`SELECT max(landmarkid) FROM landmark`)).rows[0].max;

    if (!req.body.landmarkname || !req.body.century || !req.body.type 
        || !req.body.height || !req.body.artstyle || !req.body.cityname || !req.body.countryname 
        || !req.body.architectname || !req.body.architectsurname) {
            res.status(400).send('Invalid input');
    }

    let data = req.body;
    const name = req.body.landmarkname;
    const century = req.body.century;
    const type = req.body.type;
    const height = req.body.height;
    const artstyle = req.body.artstyle;
    const city = req.body.cityname;
    const country = req.body.countryname;
    const architectname = req.body.architectname;
    const architectsurname = req.body.architectsurname;

    // arhitekt
    var test = (await pool.query(format(`SELECT architectname, architectsurname FROM architect WHERE architectname like '%s' AND architectsurname like '%s'`, architectname, architectsurname))).rows[0];
    if (!test) await pool.query(format(`INSERT INTO architect (architectname, architectsurname) VALUES('%s','%s') RETURNING architectid;`, architectname, architectsurname));

    // drzava
    test = (await pool.query(format(`SELECT * FROM country WHERE countryname like '%s'`, country))).rows[0];
    if (!test) await pool.query(format(`INSERT INTO country (countryname) VALUES('%s');`, country));

    // grad
    test = (await pool.query(format(`SELECT cityname FROM city WHERE cityname like '%s'`, city))).rows[0];
    if (!test) await pool.query(format(`INSERT INTO city (cityname,countryname) VALUES('%s','%s');`, city, country));

    // znamenitost
    test = (await pool.query(format(`SELECT * FROM landmark WHERE landmarkname like '%s'`,name))).rows[0];
    if (!test) await pool.query(format(`INSERT INTO landmark (landmarkName,century,type,height,artStyle,cityName) VALUES('%s',%s,'%s',%s,'%s','%s') RETURNING landmarkid;`, name, century, type, height,artstyle, city));

    // povezat arhitekte s znamenitostima
    test = (await pool.query(format(`SELECT landmarkid, architectid FROM landmarkarch WHERE 
                landmarkid in (SELECT landmarkid FROM landmark WHERE landmarkname like '%s') 
                AND architectid IN (SELECT architectid FROM architect WHERE architectname like '%s' 
                AND architectsurname like '%s')`, name,architectname,architectsurname))).rows[0];
    if (!test) await pool.query(format(`INSERT INTO landmarkarch (landmarkid, architectid) VALUES(
                (SELECT landmarkid FROM landmark WHERE landmarkname like '%s'), 
                (SELECT architectid FROM architect WHERE architectname like '%s' 
                AND architectsurname like '%s'));`,  name,architectname,architectsurname));


    var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`,downloadSelect,jsonPath);
    var csv = format(`COPY (%s) TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect, csvPath);
    await pool.query(json);
    await pool.query(csv);

    var maxIdAfter = (await pool.query(`SELECT max(landmarkid) FROM landmark`)).rows[0].max;
    let response;
    if (maxIdAfter === maxIdBefore){
        response = format (
            `{
                "status":"200 OK",
                "message":"The landmark with provided informations already exists.",
                "response": [
                    "@context": {
                        "@vocab": "https://schema.org/",
                        "landmarkname": "name",
                        "century": "century",
                        "type": "type",
                        "height": "height",
                        "artstyle": "artstyle",
                        "cityname": "https://schema.org/City",
                        "countryname": "https://schema.org/Country",
                        "architectname": "givenName",
                        "architectsurname": "familyName"
                    }, %s]
            }`
        ,data);
        
        res.set({
            'method': 'POST',
            "status":"200 OK",
            "message":"The landmark with provided informations already exists.",
            'Content-type':'application/json'
        });
    } else {
        response = format (
            `{
                "status":"201 Created",
                "message":"The new landmark is effectively created.",
                "response": [
                    "@context": {
                        "@vocab": "https://schema.org/",
                        "landmarkname": "name",
                        "century": "century",
                        "type": "type",
                        "height": "height",
                        "artstyle": "artstyle",
                        "cityname": "https://schema.org/City",
                        "countryname": "https://schema.org/Country",
                        "architectname": "givenName",
                        "architectsurname": "familyName"
                    }, %s]
            }`
        ,data);
        
        res.set({
            'method': 'POST',
            "status":"201 Created",
            "message":"The new landmark is effectively created.",
            'Content-type':'application/json'
        });
    }

    response = JSON.parse(response);
    res.status(200).send(response);
});

// PUT /api/znamenitosti/:id
router.put('/:id',async(req,res) => {
    const id = req.params.id;
    
    checkId(id, req.method, res);

    const sql = (await pool.query(format(`%s WHERE landmark.landmarkId=%s`, displaySelect, id))).rows[0];
    const body = req.body;

    console.log(body);
    console.log(sql);
    if (body.landmarkname !== sql.landmarkname) {
        var sqlic = format(`UPDATE landmark SET landmarkname = '%s' WHERE landmarkid = %s`, body.landmarkname, id);
        await pool.query(sqlic);
    }
    if (body.type !== sql.type) {
        var sqlic = format(`UPDATE landmark SET type = '%s' WHERE landmarkid = %s`, body.type, id);
        await pool.query(sqlic);
    }

    if (body.century !== sql.century) {
        var sqlic = format(`UPDATE landmark SET century = %s WHERE landmarkid = %s`, body.century, id);
        await pool.query(sqlic);
    }
    if (body.height !== sql.height) {
        var sqlic = format(`UPDATE landmark SET height = %s WHERE landmarkid = %s`, body.height, id);
        await pool.query(sqlic);
    }
    if (body.artstyle !== sql.artstyle) {
        var sqlic = format(`UPDATE landmark SET artstyle = '%s' WHERE landmarkid = %s`, body.artstyle, id);
        await pool.query(sqlic);
    }
    if (body.countryname !== sql.countryname) {
        var sql1 = format(`UPDATE country SET countryname = '%s' WHERE countryname like '%s'`, body.countryname, sql.countryname);
        await pool.query(sql1);

        var sql2 = format(`UPDATE city SET countryname = '%s' WHERE countryname like '%s'`, body.countryname, sql.countryname);
        await pool.query(sql2);
    }
    if (body.cityname !== sql.cityname) {
        var sql1 = format(`UPDATE city SET cityname = '%s' WHERE cityname like '%s'`, body.countryname, sql.countryname);
        await pool.query(sql1);

        var sql2 = format(`UPDATE landmark SET cityname = '%s' WHERE landmarkid = %s`, body.countryname, sql.countryname);
        await pool.query(sql2);
    }
    if (body.architectname !== sql.architectname || body.architectsurname !== sql.architectsurname) {
        var sqlic = format(`UPDATE architect SET architectname = '%s' AND architectsurname = '%s' WHERE architectname like '%s' 
                    AND architectsurname like '%s'`, body.architectname, body.architectsurname, sql.architectname, sql.architectsurname);
        await pool.query(sqlic);
    }


    var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`,downloadSelect,jsonPath);
    var csv = format(`COPY (%s) TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect, csvPath);
    await pool.query(json);
    await pool.query(csv);

    let response = format (
        `{
            "status":"200 OK",
            "message":"The landmark with id = %s successfully updated.",
            "response": [
                "@context": {
                    "@vocab": "https://schema.org/",
                    "landmarkname": "name",
                    "century": "century",
                    "type": "type",
                    "height": "height",
                    "artstyle": "artstyle",
                    "cityname": "https://schema.org/City",
                    "countryname": "https://schema.org/Country",
                    "architectname": "givenName",
                    "architectsurname": "familyName"
                }, %s]
        }`
    ,id,body);

    response = JSON.parse(response);
    res.status(200).send(response);
});

// DELETE /api/znamenitosti/:id
router.delete('/:id',async(req,res) => {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    const id = req.params.id;

    checkId(id, req.method, res);

    await pool.query(format(`DELETE FROM landmarkarch WHERE landmarkid=%s`,id));
    await pool.query(format(`DELETE FROM landmark WHERE landmarkid=%s`,id));
    var response = format (
        `{
            "status":"200 OK",
            "message":"The landmark with id = %s successfully deleted.",
            "response": null
        }`
    ,id);

    var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) to '%s'`,downloadSelect,jsonPath);
    var csv = format(`COPY (%s) TO '%s' DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect, csvPath);
    await pool.query(json);
    await pool.query(csv);

    res.status(200).send(response);
});

router.use((req,res) => {

    // metoda nije implementirana
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
        
        let response = {
            "status":"501 Not Implemented",
            "message":"The server does not support the functionality required to fulfill the request.",
            "response":null
        }

        res.set({
            'method': req.method,
            'status':'501 Not Implemented',
            'message':'The server does not support the functionality required to fulfill the request.',
            'Content-type':'application/json'
        });

        res.status(501).send(response);
    }

    // metoda nije pronađena
    let response = {
        "status":"404 Not Found",
        "message":"The server cannot find the requested resource.",
        "response":null
    }
    
    res.set({
        'method': req.method,
        'status':'404 Not Found',
        'message':'The server cannot find the requested resource.',
        'Content-type':'application/json'
    });

    res.status(404).send(response);
});

module.exports = router;