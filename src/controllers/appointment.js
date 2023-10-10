const Appointment = require("../model/appointment");
const Applicant = require("../model/applicant");
const mongoose = require("mongoose");

exports.get_appointments = async (req, res, next) => {
  try {
    const { _id: userId, role } = req.user;
    const { visa, status, owner } = req.query;

    const { enum: ownerEmuns } = Appointment.schema.path("owner").options;
    const { enum: visaEmuns } = Appointment.schema.path("visa").options;
    const { enum: statusEmuns } = Appointment.schema.path("status").options;

    const queryObject = {};

    if (visa) {
      queryObject.visa = visa;
    }
    if (status) {
      queryObject.status = status;
    }
    if (owner) {
      queryObject.owner = owner;
    }

    let appointments = [];
    if (role === "admin") {
      appointments = await Appointment.aggregate([
        { $match: { ...queryObject, isDeleted: { $ne: true } } },
        {
          $lookup: {
            from: "applicants",
            localField: "_id",
            foreignField: "appointment",
            as: "applicants",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "lastUpdatedBy",
            foreignField: "_id",
            as: "lastUpdatedBy",
          },
        },
        {
          $addFields: {
            applicants: {
              $filter: {
                input: "$applicants",
                as: "applicant",
                cond: { $ne: ["$$applicant.isDeleted", true] },
              },
            },
            numberOfApplicants: { $size: "$applicants" },
          },
        },
        { $unwind: "$applicants" },
        { $sort: { "applicants.index": 1 } },
        {
          $group: {
            _id: "$_id",
            applicants: { $push: "$applicants" },
            data: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$data", { applicants: "$applicants" }],
            },
          },
        },
        {
          $project: {
            "applicants.__v": 0,
            "applicants.isDeleted": 0,
            "applicants.appointment": 0,
            "lastUpdatedBy.password": 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
    }

    const assignedAppointments = await Appointment.aggregate([
      {
        $match: {
          ...queryObject,
          isDeleted: { $ne: true },
          assignedUsers: userId,
        },
      },
      {
        $lookup: {
          from: "applicants",
          localField: "_id",
          foreignField: "appointment",
          as: "applicants",
        },
      },
      {
        $addFields: {
          applicants: {
            $filter: {
              input: "$applicants",
              as: "applicant",
              cond: { $ne: ["$$applicant.isDeleted", true] },
            },
          },
          numberOfApplicants: { $size: "$applicants" },
        },
      },
      { $unwind: "$applicants" },
      { $sort: { "applicants.index": 1 } },
      {
        $group: {
          _id: "$_id",
          applicants: { $push: "$applicants" },
          data: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$data", { applicants: "$applicants" }],
          },
        },
      },
      {
        $project: {
          __v: 0,
          updatedAt: 0,
          isDeleted: 0,
          "applicants.__v": 0,
          "applicants.updatedAt": 0,
          "applicants.createdAt": 0,
          "applicants.isDeleted": 0,
          "applicants.appointment": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const createdAppointments = await Appointment.aggregate([
      {
        $match: { ...queryObject, createdBy: userId, isDeleted: { $ne: true } },
      },
      {
        $lookup: {
          from: "applicants",
          localField: "_id",
          foreignField: "appointment",
          as: "applicants",
        },
      },
      {
        $addFields: {
          applicants: {
            $filter: {
              input: "$applicants",
              as: "applicant",
              cond: { $ne: ["$$applicant.isDeleted", true] },
            },
          },
          numberOfApplicants: { $size: "$applicants" },
        },
      },
      { $unwind: "$applicants" },
      { $sort: { "applicants.index": 1 } },
      {
        $group: {
          _id: "$_id",
          applicants: { $push: "$applicants" },
          data: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$data", { applicants: "$applicants" }],
          },
        },
      },
      {
        $project: {
          __v: 0,
          updatedAt: 0,
          isDeleted: 0,
          "applicants.__v": 0,
          "applicants.updatedAt": 0,
          "applicants.createdAt": 0,
          "applicants.isDeleted": 0,
          "applicants.appointment": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({
      success: true,
      payload: {
        assignedAppointments,
        createdAppointments,
        appointments,
      },
      attributes: { ownerEmuns, visaEmuns, statusEmuns },
    });
  } catch (err) {
    next(err);
  }
};

exports.get_appointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.create_appointment = async (req, res, next) => {
  try {
    const {
      expectedTravelDate,
      email,
      phone,
      note,
      applicants,
      visa,
      owner,
      status,
    } = req.body;

    if (applicants.length < 1 || applicants.length > 5) {
      const customError = new Error();
      customError.name = "ValidationError";
      customError.errors = {
        applicants: {
          path: "applicants",
          value: applicants,
          message: "Must provide between 1 and 5 applicants",
        },
      };
      throw customError;
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      //create appointment
      const createdAppointment = await Appointment.create(
        [
          {
            createdBy: req.user._id,
            expectedTravelDate,
            email,
            phone,
            note,
            visa,
            owner,
            assignedUsers: [req.user._id],
            status,
          },
        ],
        { session }
      );
      // create applicants
      const applicantDocs = await Promise.all(
        applicants.map(async (applicant, index) => {
          return await Applicant.create(
            [
              {
                ...applicant,
                appointment: createdAppointment[0]._id,
                index,
              },
            ],
            { session }
          );
        })
      );
      await session.commitTransaction();
      return res
        .status(201)
        .json({ appointment: createdAppointment, applicants: applicantDocs });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    next(err);
  }
};

exports.delete_appointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndUpdate(id, { isDeleted: true });
    await Applicant.updateMany({ appointment: id }, { isDeleted: true });

    res.status(201).json({ message: "appointment deleted successfully." });
  } catch (err) {
    next(err);
  }
};

exports.update_appointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expectedTravelDate, email, phone, note, status, owner, visa } =
      req.body;

    const updateQuery = {};

    if (typeof expectedTravelDate !== "undefined") {
      updateQuery.expectedTravelDate = expectedTravelDate;
    }

    if (typeof email !== "undefined") {
      updateQuery.email = email;
    }

    if (typeof phone !== "undefined") {
      updateQuery.phone = phone;
    }

    if (typeof note !== "undefined") {
      updateQuery.note = note;
    }

    if (typeof status !== "undefined") {
      updateQuery.status = status;
    }

    if (typeof owner !== "undefined") {
      updateQuery.owner = owner;
    }

    if (typeof visa !== "undefined") {
      updateQuery.visa = visa;
    }

    updateQuery.lastUpdatedBy = req.user._id;

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      updateQuery,
      { new: true, runValidators: true }
    ).populate("lastUpdatedBy", ["email"]);

    res.json(updatedAppointment);
  } catch (err) {
    next(err);
  }
};
