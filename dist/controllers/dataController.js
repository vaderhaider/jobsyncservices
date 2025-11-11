"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.postCallAnalysis = exports.getCallAnalysis = exports.deleteCandidate = exports.reachOut = exports.getCandidate = exports.deleteJob = exports.postData = exports.getData = void 0;
exports.sendJobToManatal = sendJobToManatal;
const job_1 = require("../models/job");
const candidate_1 = require("../models/candidate");
const callAnalysis_1 = require("../models/callAnalysis");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../models/user");
const axios_1 = __importDefault(require("axios"));
const MANATAL_API_URL = 'https://api.manatal.com/open/v3';
const MANATAL_API_KEY = 'Token 1a617e053c1a4101a7b1e646caf226a025325930';
async function sendJobToManatal({ organizationName, title, description, location }) {
    try {
        // 1. Check if organization exists
        const orgRes = await axios_1.default.get(`${MANATAL_API_URL}/organizations/`, {
            params: { name: organizationName },
            headers: { Authorization: MANATAL_API_KEY }
        });
        let organizationID;
        if (orgRes.data.count > 0) {
            organizationID = orgRes.data.results[0].id;
        }
        else {
            // 2. Create organization
            const createOrgRes = await axios_1.default.post(`${MANATAL_API_URL}/organizations/`, { name: organizationName }, {
                headers: { Authorization: MANATAL_API_KEY }
            });
            organizationID = createOrgRes.data.id;
        }
        // 3. Create job
        const jobRes = await axios_1.default.post(`${MANATAL_API_URL}/jobs/`, {
            organization: organizationID,
            position_name: title,
            description,
            address: location
        }, {
            headers: { Authorization: MANATAL_API_KEY }
        });
        return jobRes.data;
    }
    catch (err) {
        console.error('Error sending job to Manatal:', err);
        throw err;
    }
}
const getData = async (req, res) => {
    const { userID } = req.query;
    let jobs;
    if (userID && mongoose_1.default.Types.ObjectId.isValid(userID)) {
        jobs = await job_1.Job.find({ userID: new mongoose_1.default.Types.ObjectId(userID) });
    }
    else if (userID) {
        jobs = await job_1.Job.find({ userID: userID });
    }
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
    const { title, description, requirements, organizationName, location, userID } = req.body;
    const newJob = new job_1.Job({ title, description, organizationName, location, requirements, userID });
    await newJob.save();
    // Send job to Manatal
    try {
        const manatalResponse = await sendJobToManatal({ organizationName, title, description, location });
        // If Manatal returned an id, persist it into the job document
        if (manatalResponse && typeof manatalResponse.id !== 'undefined') {
            const updatedJob = await job_1.Job.findByIdAndUpdate(newJob._id, { ManatalJobId: manatalResponse.id }, { new: true });
            console.log('Saved ManatalJobId on Job:', manatalResponse.id);
            return res.status(200).json({ message: 'Data received successfully', job: updatedJob });
        }
        else {
            // No id returned — still respond success for local save
            console.warn('Manatal response did not include id:', manatalResponse);
            return res.status(200).json({ message: 'Data received successfully', job: newJob });
        }
    }
    catch (err) {
        console.error('Failed to send job to Manatal:', err);
        // Return success for local save but include warning
        return res.status(200).json({ message: 'Data received; failed to send to Manatal', job: newJob, error: err });
    }
};
exports.postData = postData;
const deleteJob = async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.status(400).json({ message: 'Job _id is required for deletion.' });
    }
    try {
        // If _id is not a valid ObjectId, use findOneAndDelete
        let deletedJob;
        if (mongoose_1.default.Types.ObjectId.isValid(_id)) {
            deletedJob = await job_1.Job.findByIdAndDelete(_id);
        }
        else {
            deletedJob = await job_1.Job.findOneAndDelete({ _id });
        }
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
    console.log('getCandidate route hit');
    console.log(req.body);
    const { jobIds } = req.body;
    let candidates;
    if (Array.isArray(jobIds) && jobIds.length > 0) {
        candidates = await candidate_1.Candidate.find({ jobID: { $in: jobIds } });
        console.log('Candidates found for jobIds:', jobIds, candidates);
    }
    else {
        console.log('No candidates found: invalid or empty jobIds');
    }
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
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const existingUser = await user_1.User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        const newUser = new user_1.User({ username, password });
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error registering user', error: err });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const user = await user_1.User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        return res.status(200).json({ message: 'Login successful', user });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error logging in', error: err });
    }
};
exports.loginUser = loginUser;
