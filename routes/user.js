var express = require('express');
var router = express.Router();
const Zip = require("adm-zip");

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

async function createZip() {
    var json = format(`COPY (SELECT array_to_json(array_agg(row_to_json(landmarks))) FROM (%s) landmarks) 
    to 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/landmarks/landmarks.json'`, downloadSelect);
    var csv = format(`COPY (%s) TO 'C:/Users/marti/Documents/GitHub/studosi - lab2 or/Znamenitosti/public/landmarks/landmarks.csv'
     DELIMITER ',' ENCODING 'utf-8' CSV HEADER`, displaySelect);
    await pool.query(json);
    await pool.query(csv);
    
    const zip = new Zip();
    const outputFile = "landmarks.zip";
    zip.addLocalFolder("./public/landmarks");
    zip.writeZip(outputFile);
}

router.get('/', function(req, res, next) {
    if (!req.oidc.isAuthenticated()) {
        res.send("Korisnik nije prijavljen").status(401);
    } else {
        createZip();
        res.render('user', {
            isAuthenticated: req.oidc.isAuthenticated(),
            user: req.oidc.user
        });
    }
});

module.exports = router;