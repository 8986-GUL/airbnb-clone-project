const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
   console.log(req.user);
     if(!req.isAuthenticated()) {
      req.session.redirectUrl =req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirecturl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = async(req, res, next) => {
   let { id } = req.params;
       let listing = await Listing.findById(id);
       if(!currUser && listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permission to edit");
       return res.redirect(`/listings/${id}`);
       }
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Use req.user (Passport attaches the logged-in user)
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};