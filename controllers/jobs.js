const parseVErr = require("../util/parseValidationErr");
const User = require("../models/User");
const Job = require("../models/Job");

// Get all jobs created/owned by this user
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user._id}).sort('createdAt');
  res.render("../views/jobs", { jobs });
};

// Add a new job
const addJob = async (req, res) => {
  try {
    await Job.create({
      company: req.body.company,
      position: req.body.position,
      status: req.body.status,
      createdBy: req.user._id,
    });
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else {
      req.flash("error", e.message);
    }
    console.log(e);
    return res.redirect("/jobs");
  }
  return res.redirect("/jobs");
};

// Open the job creation form
const createJob = (req, res) => {
  res.render("../views/job", { job: null });
};

// Open the job edit form for the selected job
const getJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id });
  res.render("../views/job", { job });
};

// Update a job from the job edit form
const updateJob = async (req, res) => {
  const id = req.params.id;
  const job = await Job.findOne({_id: id});

  // Verify job ownership
  if (String(req.user._id) !== String(job.createdBy)) {
    req.flash("error", "User does not have access to this job");
    return res.redirect("/jobs");
  }

  // Update job
  try {
    await Job.findOneAndUpdate(
      { _id: id },
      {
        company: req.body.company,
        position: req.body.position,
        status: req.body.status,
        createdBy: req.user._id,
      },
      { runValidators: true },
    );
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else {
      req.flash("error", e.message);
    }
    console.log(e);
    return res.redirect("/jobs");
  }
  return res.redirect("/jobs");
};

// Delete a job
const deleteJob = async (req, res) => {
  const id = req.params.id;
  const job = await Job.findOne({_id: id});

  // Verify job ownership
  if (String(req.user._id) !== String(job.createdBy)) {
    req.flash("error", "User does not have access to this job");
    return res.redirect("/jobs");
  }

  // Delete job
  try {
    await Job.findOneAndDelete({ _id: id });
  } catch (e) {
    console.log(e);
    return res.redirect("/jobs");
  }
  return res.redirect("/jobs");
};

module.exports = {
  getAllJobs,
  addJob,
  createJob,
  getJob,
  updateJob,
  deleteJob,
};
