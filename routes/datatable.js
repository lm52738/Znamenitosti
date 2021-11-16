var express = require('express');
const db = require('../db/db')
var router = express.Router();

router.get('/',async (req,res) => {
    try {
        const landmarks = await db.query("SELECT landmark.landmarkId,landmarkName,century,type,height, artStyle,city.cityName,country.countryName,architect.architectName,architectSurname FROM landmark LEFT JOIN city ON landmark.cityName = city.cityName LEFT JOIN country ON city.countryName = country.countryName LEFT JOIN landmarkArch ON landmarkArch.landmarkId = landmark.landmarkId LEFT JOIN architect ON  architect.architectId = landmarkArch.architectId;");
        res.render('datatable', {
            title: 'Data',
            data: landmarks.rows
          });
    } catch (error) {
        console.error(error.message);
    }
});

router.download('/',async (req,res) => {
    const 
});




module.exports = router;
