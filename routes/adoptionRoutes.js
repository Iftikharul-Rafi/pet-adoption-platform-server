import express from "express";

import {

  createAdoptionRequest,

  getMyRequests,

  deleteRequest,

  getReceivedRequests,

  approveRequest,

  rejectRequest,

} from "../controllers/adoptionController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();




// ===============================
// CREATE ADOPTION REQUEST
// PRIVATE ROUTE
// ===============================
router.post(
  "/",
  verifyToken,
  createAdoptionRequest
);








// ===============================
// GET MY REQUESTS
// PRIVATE ROUTE
// ===============================
router.get(
  "/my-requests",
  verifyToken,
  getMyRequests
);









// ===============================
// GET RECEIVED REQUESTS
// PRIVATE ROUTE
// ===============================
router.get(
  "/received",
  verifyToken,
  getReceivedRequests
);









// ===============================
// APPROVE REQUEST
// PRIVATE ROUTE
// ===============================
router.patch(
  "/approve/:id",
  verifyToken,
  approveRequest
);









// ===============================
// REJECT REQUEST
// PRIVATE ROUTE
// ===============================
router.patch(
  "/reject/:id",
  verifyToken,
  rejectRequest
);









// ===============================
// DELETE REQUEST
// PRIVATE ROUTE
// ===============================
router.delete(
  "/:id",
  verifyToken,
  deleteRequest
);









export default router;