import express from "express";

import {
  addPet,
  getAllPets,
  getSinglePet,
  getMyListings,
  updatePet,
  deletePet,
} from "../controllers/petController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();




// ===============================
// GET ALL PETS
// PUBLIC ROUTE
// ===============================
router.get("/", getAllPets);





// ===============================
// GET MY LISTINGS
// PRIVATE ROUTE
// ===============================
router.get(
  "/my/listings",
  verifyToken,
  getMyListings
);





// ===============================
// GET SINGLE PET
// PUBLIC ROUTE
// ===============================
router.get("/:id", getSinglePet);





// ===============================
// ADD PET
// PRIVATE ROUTE
// ===============================
router.post(
  "/",
  verifyToken,
  addPet
);





// ===============================
// UPDATE PET
// PRIVATE ROUTE
// ===============================
router.put(
  "/:id",
  verifyToken,
  updatePet
);





// ===============================
// DELETE PET
// PRIVATE ROUTE
// ===============================
router.delete(
  "/:id",
  verifyToken,
  deletePet
);





export default router;