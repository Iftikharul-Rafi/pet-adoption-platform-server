import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },

    petName: {
      type: String,
      required: true,
    },



    // requester info
    userName: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },



    // owner
    ownerEmail: {
      type: String,
      required: true,
    },



    pickupDate: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },



    // request status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

  },
  {
    timestamps: true,
  }
);

const Adoption = mongoose.model(
  "Adoption",
  adoptionSchema
);

export default Adoption;

..