const mongoose = require("mongoose");

const listingSchema = mongoose.Schema(
  {
    "ad title": {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minLength: [5, "too short title"],
      maxLength: [200, "too long title"],
    },

    "description": {
      type: String,
      required: [true, "description is required"],
      minLength: [10, "too short description"],
    },

    "property type": {
      type: String,
    },

    "area": {
      type: Number,
    },

    "sale or rent": {
      type: String,
    },

    "amenities": [String],

    "number of rooms": {
      type: Number,
    },

    "number of bathrooms": {
      type: Number,
    },

    "furnishing": {
      type: Boolean,
    },

    "property condition": {
      type: String,
    },

    "delivery conditions": {
      type: String,
    },

    "property location": {
      type: String,
    },

    "rental rate": {
      type: String,
    },

    "rental fees": {
      type: String,
    },

    "security deposit": {
      type: Number,
    },

    "payment method": {
      type: String,
    },

    "price": {
      type: String,
    },

    "negotiable": {
      type: Boolean,
    },

    "name": {
      type: String,
    },

    "phone number": {
      type: String,
    },

    "contact method": {
      type: String,
    },

    "images": [String],

    "brand": {
      type: String,
    },

    "additional features": [String],

    "fuel type": [String],

    "category": {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "category is required"],
    },

    "user": {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },

    "rating average": {
      type: Number,
      min: [1, "the number must be greater than 1"],
      max: [5, "the number can't be greater than 5"],
    },


    "rating quantity": {
      type: Number,
      default: 0,
    },


   
    "transmission type": {
      type: String,
    },

    "kilometers": {
      type: String,
    },

    "down payment": {
      type: String,
    },

    "lat":{
      type:Number
    },
    "long":{
      type:Number
    },


    "post":{
      type:Boolean,
      default:false

    },
    "pending":{
      type:Boolean,
      default:true,
    },
    "rejected":{
      type:Boolean,
      default:false
    },
    "count1":{
      type:Number,
      default:0
    },
    "count2":{
      type:Number,
      default:0
    },
    "count3":{
      type:Number,
      default:0
    },
    "count4":{
      type:Number,
      default:0
    },
    "count5":{
      type:Number,
      default:0
    },


 


  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const setImageUrl = (doc) => {
  if (doc.images && Array.isArray(doc.images)) {
    const image = doc.images.map((item) => `${process.env.BASE_URL}/listing/${item}`);
    doc.images = image;
  }
};

listingSchema.post("init", (doc) => {
  setImageUrl(doc);
});

listingSchema.post("save", (doc) => {

  setImageUrl(doc);
});

const listingModel = mongoose.model("listing", listingSchema);

module.exports = listingModel;
