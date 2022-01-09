var express = require('express');
var router = express.Router();
const Zip = require("adm-zip");

async function createZip() {
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