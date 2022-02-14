const router = require("express").Router();
const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const mongoose = require("mongoose");

router.get("/create", (req, res, next)=> {
    res.render("claims/claim-create");
});

router.post("/create", async (req, res, next)=> {
    try {
        // const { debtor, debtorLocation, faceValue, currency, type, minimumPrice, performance, maturity } = req.body;
        req.body.seller = mongoose.Types.ObjectId();
        const dbClaim = await Claim.create(req.body);
        res.redirect("/claims");
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const allClaims = await Claim.find();
        res.render("claims/claims-overview", {claims: allClaims});
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/details", async (req, res, next) => {
    try {
        const oneClaim = await Claim.findById(req.params.claimId).lean();
        for (let key in oneClaim) {
            if (key.startsWith("_") || key == 'createdAt' || key == 'updatedAt') delete oneClaim[key]; 
        }
        res.render("claims/claim-details", {claim: oneClaim});
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;