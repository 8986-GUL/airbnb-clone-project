const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// Middleware for review
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Reviews post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviewPost));

// Delete review route
router.delete("/:reviewId", wrapAsync(reviewController.deleteReview));

module.exports = router;