import Pet from "../models/petModel.js";

// ===============================
// ADD PET
// ===============================
export const addPet = async (req, res) => {

  try {

    const petData = req.body;

    // validation
    if (
      !petData.petName ||
      !petData.species ||
      !petData.breed ||
      !petData.age ||
      !petData.gender ||
      !petData.location ||
      !petData.image
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    // create pet
    const newPet = await Pet.create({
      ...petData,
      adopted: false,
    });

    res.status(201).json({
      success: true,
      message: "Pet added successfully",
      pet: newPet,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// GET ALL PETS
// ===============================
export const getAllPets = async (req, res) => {

  try {

    const { search, species } = req.query;

    let query = {
      adopted: false,
    };

    // search by pet name
    if (search) {
      query.petName = {
        $regex: search,
        $options: "i",
      };
    }

    // filter by species
    if (species?.length) {
      query.species = {
        $in: species.split(","),
      };
    }

    const pets = await Pet.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      pets,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// GET SINGLE PET
// ===============================
export const getSinglePet = async (req, res) => {

  try {

    const { id } = req.params;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    res.status(200).json({
      success: true,
      pet,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// GET MY LISTINGS
// ===============================
export const getMyListings = async (req, res) => {

  try {

    const pets = await Pet.find({
      ownerEmail: req.user.email,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      pets,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// UPDATE PET
// ===============================
export const updatePet = async (req, res) => {

  try {

    const { id } = req.params;

    const updatedData = req.body;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // owner check
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      pet: updatedPet,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// DELETE PET
// ===============================
export const deletePet = async (req, res) => {

  try {

    const { id } = req.params;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // owner check
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // adopted pet cannot delete
    if (pet.adopted) {
      return res.status(400).json({
        success: false,
        message: "Adopted pet cannot be deleted",
      });
    }

    await Pet.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Pet deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};