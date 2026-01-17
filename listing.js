const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const review = require("../models/review.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});


// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));
// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post('/listings', upload.single('image'), async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.image = req.file.url;   // Cloudinary gives you a URL
  listing.filename = req.file.filename; // optional
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
  console.log(req.file);
});

// Edit Route
router.get("/:id/edit", isLoggedIn,  isOwner, wrapAsync(listingController.editListing));

//Update Route
router.put("/:id", isLoggedIn, isOwner, wrapAsync());

// Delete Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

module.exports = router;