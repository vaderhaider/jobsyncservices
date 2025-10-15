"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCallAnalysis = exports.getCallAnalysis = exports.deleteCandidate = exports.reachOut = exports.getCandidate = exports.deleteJob = exports.postData = exports.getData = void 0;
const job_1 = require("../models/job");
const candidate_1 = require("../models/candidate");
const callAnalysis_1 = require("../models/callAnalysis");
const getData = async (req, res) => {
    const jobs = await job_1.Job.find();
    res.json({ jobs });
};
exports.getData = getData;
const postData = async (req, res) => {
    // If PUT, update existing job
    if (req.method === 'PUT') {
        const { _id, title, description, requirements } = req.body;
        if (!_id) {
            return res.status(400).json({ message: 'Job _id is required for update.' });
        }
        try {
            const updatedJob = await job_1.Job.findByIdAndUpdate(_id, { title, description, requirements }, { new: true });
            if (!updatedJob) {
                return res.status(404).json({ message: 'Job not found.' });
            }
            return res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
        }
        catch (err) {
            return res.status(500).json({ message: 'Error updating job', error: err });
        }
    }
    // Otherwise, create new job (POST)
    console.log('postData route hit with body:', req.body);
    const { title, description, requirements, organizationName, location } = req.body;
    const newJob = new job_1.Job({ title, description, organizationName, location, requirements });
    await newJob.save();
    res.status(200).json({ message: 'Data received successfully' });
};
exports.postData = postData;
const deleteJob = async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.status(400).json({ message: 'Job _id is required for deletion.' });
    }
    try {
        const deletedJob = await job_1.Job.findByIdAndDelete(_id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found.' });
        }
        return res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error deleting job', error: err });
    }
};
exports.deleteJob = deleteJob;
const getCandidate = async (req, res) => {
    const candidates = await candidate_1.Candidate.find();
    res.json({ candidates });
};
exports.getCandidate = getCandidate;
const reachOut = async (req, res) => {
    console.log('reachOut route hit with body:', req.body);
    const { _id } = req.body;
    if (!_id) {
        console.log('Missing _id, sending 400');
        return res.status(400).json({ message: 'Document _id is required.' });
    }
    try {
        const updatedCandidate = await candidate_1.Candidate.findByIdAndUpdate(_id, { ReachOut: true }, { new: true });
        if (!updatedCandidate) {
            console.log('Candidate not found, sending 404');
            return res.status(404).json({ message: 'Candidate not found.' });
        }
        console.log('ReachOut set to true, sending 200:');
        return res.status(200).json({ message: 'ReachOut set to true', candidate: updatedCandidate });
    }
    catch (err) {
        console.log('Error updating candidate, sending 500:', err);
        return res.status(500).json({ message: 'Error updating candidate', error: err });
    }
};
exports.reachOut = reachOut;
const deleteCandidate = async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.status(400).json({ message: 'Candidate _id is required for deletion.' });
    }
    try {
        const deletedCandidate = await candidate_1.Candidate.findByIdAndDelete(_id);
        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }
        return res.status(200).json({ message: 'Candidate deleted successfully', candidate: deletedCandidate });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error deleting candidate', error: err });
    }
};
exports.deleteCandidate = deleteCandidate;
const getCallAnalysis = async (req, res) => {
    const { Name, Position, Organization } = req.query;
    console.log(Name, Position, Organization);
    if (!Name || !Position || !Organization) {
        return res.status(400).json({ message: 'Name, Position, and Organization are required as query parameters.' });
    }
    const query = {
        Name: { $regex: Name, $options: 'i' },
        Position: { $regex: Position, $options: 'i' },
        Organization: { $regex: Organization, $options: 'i' }
    };
    console.log('MongoDB query:', query);
    try {
        const result = await callAnalysis_1.callAnalysis.find(query);
        console.log('MongoDB result:', result);
        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'No call analysis data found.' });
        }
        return res.status(200).json({ callAnalysis: result });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching call analysis', error: err });
    }
};
exports.getCallAnalysis = getCallAnalysis;
const postCallAnalysis = async (req, res) => {
    try {
        const newCallAnalysis = new callAnalysis_1.callAnalysis(req.body);
        await newCallAnalysis.save();
        return res.status(201).json({ message: 'Call analysis entry created successfully', callAnalysis: newCallAnalysis });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error creating call analysis entry', error: err });
    }
};
exports.postCallAnalysis = postCallAnalysis;
