const Contact = require("../models/Contact");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return next(new AppError("Name, email and message are required", 400));
    }
    const contact = await Contact.create({ name, email, subject, message });
    sendResponse(res, 201, true, "Message sent successfully", contact);
  } catch (error) {
    next(error);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);
    sendResponse(res, 200, true, "Contacts fetched", {
      contacts,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return next(new AppError("Contact not found", 404));
    if (contact.status === "Unread") {
      contact.status = "Read";
      await contact.save();
    }
    sendResponse(res, 200, true, "Contact fetched", contact);
  } catch (error) {
    next(error);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status, adminReply } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return next(new AppError("Contact not found", 404));
    if (status) contact.status = status;
    if (adminReply !== undefined) contact.adminReply = adminReply;
    await contact.save();
    sendResponse(res, 200, true, "Contact updated", contact);
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return next(new AppError("Contact not found", 404));
    sendResponse(res, 200, true, "Contact deleted");
  } catch (error) {
    next(error);
  }
};
