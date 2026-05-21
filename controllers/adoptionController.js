import Adoption from "../models/adoptionModel.js";
import Pet from "../models/petModel.js";

// ===============================
// CREATE ADOPTION REQUEST
// ===============================
export const createAdoptionRequest = async (req, res) => {

  try {

    const requestData = req.body;

    // validation
    if (
      !requestData.petId ||
      !requestData.petName ||
      !requestData.userName ||
      !requestData.userEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are missing",
      });
    }

    // find pet
    const pet = await Pet.findById(requestData.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // owner cannot adopt own pet
    if (pet.ownerEmail === req.user.email) {
      return res.status(400).json({
        success: false,
        message: "You cannot adopt your own pet",
      });
    }

    // already adopted
    if (pet.adopted) {
      return res.status(400).json({
        success: false,
        message: "Pet already adopted",
      });
    }

    // already requested
    const existingRequest = await Adoption.findOne({
      petId: requestData.petId,
      userEmail: req.user.email,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already requested this pet",
      });
    }

    // create request
    const newRequest = await Adoption.create({
      ...requestData,
      userEmail: req.user.email,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Adoption request submitted",
      request: newRequest,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// GET MY REQUESTS
// ===============================
export const getMyRequests = async (req, res) => {

  try {

    const requests = await Adoption.find({
      userEmail: req.user.email,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// DELETE REQUEST
// ===============================
export const deleteRequest = async (req, res) => {

  try {

    const { id } = req.params;

    const request = await Adoption.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // unauthorized
    if (request.userEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // approved request cannot delete
    if (request.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Approved request cannot be deleted",
      });
    }

    await Adoption.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Request cancelled successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// GET RECEIVED REQUESTS
// ===============================
export const getReceivedRequests = async (req, res) => {

  try {

    const requests = await Adoption.find({
      ownerEmail: req.user.email,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// APPROVE REQUEST
// ===============================
export const approveRequest = async (req, res) => {

  try {

    const { id } = req.params;

    const request = await Adoption.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // only owner can approve
    if (request.ownerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // already approved
    if (request.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Request already approved",
      });
    }

    // find pet
    const pet = await Pet.findById(request.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // pet already adopted
    if (pet.adopted) {
      return res.status(400).json({
        success: false,
        message: "Pet already adopted",
      });
    }

    // approve request
    request.status = "approved";
    await request.save();

    // mark pet adopted
    pet.adopted = true;
    await pet.save();

    // reject other requests
    await Adoption.updateMany(
      {
        petId: request.petId,
        _id: { $ne: request._id },
      },
      {
        status: "rejected",
      }
    );

    res.status(200).json({
      success: true,
      message: "Request approved successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// REJECT REQUEST
// ===============================
export const rejectRequest = async (req, res) => {

  try {

    const { id } = req.params;

    const request = await Adoption.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // only owner can reject
    if (request.ownerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // approved request cannot reject
    if (request.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Approved request cannot be rejected",
      });
    }

    request.status = "rejected";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
