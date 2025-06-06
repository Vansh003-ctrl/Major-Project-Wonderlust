const axios = require("axios");
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.ShowListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
       req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings"); 
    }
    
    res.render("listings/show.ejs", {listing,});
};

module.exports.createListing = async (req, res, next) => {
        let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
        })
        .send()

        // Now create the listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        

        
        if(req.file){
            newListing.image = {
                 url: req.file.path,
                 filename: req.file.filename,
            };
        }

        // newListing.image = { url, filename };
        
        // ✅ Only assign geometry if geocoding was successful
        if (response.body.features.length > 0) {
        newListing.geometry = response.body.features[0].geometry;
        }

        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
};



module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
   }

   req.flash("success", "Listing Updated!");
   res.redirect(`/listings/${id}`);
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};


module.exports.destroyListing = async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};