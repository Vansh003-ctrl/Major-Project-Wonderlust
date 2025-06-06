const mongoose = require("mongoose");
const reviews = require("./reviews.js");
const { Schema } = require("mongoose");
const { required } = require("joi");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },    
    description: String,
    image: {
      url: String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    geometry: {
  type: {
    type: String,          // ✅ Now this is nested correctly
    enum: ['Point'],       // ✅ Only allows 'Point' as value
    required: true
  },
  coordinates: {
    type: [Number],        // ✅ [longitude, latitude]
    required: true
  }
}


});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await reviews.deleteMany({_id: {$in: listing.reviews}});
  }
  
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;