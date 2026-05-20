import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: true,
    },

    species: {
      type: String,
      required: true,
    },

    breed: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    healthStatus: {
      type: String,
      required: true,
    },

    vaccinationStatus: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    adoptionFee: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },



    // owner info
    ownerEmail: {
      type: String,
      required: true,
    },



    // adopted or available
    adopted: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model("Pet", petSchema);

export default Pet;