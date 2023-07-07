const Applicant = require("../model/applicant");

exports.delete_applicant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    res.status(201).json(applicant);
  } catch (err) {
    next(err);
  }
};

exports.update_applicant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, passportNumber, dateOfBirth } = req.body;

    const updateQuery = {};

    if (firstName !== undefined) {
      updateQuery.firstName = firstName;
    }

    if (lastName !== undefined) {
      updateQuery.lastName = lastName;
    }

    if (passportNumber !== undefined) {
      updateQuery.passportNumber = passportNumber;
    }

    if (dateOfBirth !== undefined) {
      updateQuery.dateOfBirth = dateOfBirth;
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    );

    if (!updatedApplicant) {
      return res.status(404).json({ message: "applicant not found" });
    }

    res.json(updatedApplicant);
  } catch (err) {
    next(err);
  }
};
