const { Request } = require("../models/Request");

/**
 * 1️⃣ Create Request (Draft)
 */
const createRequest = async (req, res) => {
  try {
    const { title, type, description, assignedApprover } = req.body;

    const request = await Request.create({
      title,
      type,
      description,
      createdBy: req.user.id,
      assignedApprover,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 2️⃣ Edit Draft
 */
const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "DRAFT") {
      return res.status(400).json({ message: "Only draft can be edited" });
    }

    if (request.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, type, description } = req.body;

    request.title = title || request.title;
    request.type = type || request.type;
    request.description = description || request.description;

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 3️⃣ Submit Request
 */
const submitRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "DRAFT") {
      return res.status(400).json({ message: "Only draft can be submitted" });
    }

    if (request.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "SUBMITTED";

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 4️⃣ Approve Request
 */
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "SUBMITTED") {
      return res
        .status(400)
        .json({ message: "Only submitted requests can be approved" });
    }

    if (request.assignedApprover.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not assigned approver" });
    }

    request.status = "APPROVED";

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 5️⃣ Reject Request
 */
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "SUBMITTED") {
      return res
        .status(400)
        .json({ message: "Only submitted requests can be rejected" });
    }

    if (request.assignedApprover.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not assigned approver" });
    }

    request.status = "REJECTED";

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 6️⃣ Get My Requests
 */
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ createdBy: req.user.id });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  updateRequest,
  submitRequest,
  approveRequest,
  rejectRequest,
  getMyRequests,
};
