import { Request, Response } from 'express';
import { Job } from '../models/job';  
import { Candidate } from '../models/candidate';
import { callAnalysis } from '../models/callAnalysis';
import { mongo } from 'mongoose';


export const getData = async (req: Request, res: Response) => {
    const jobs = await Job.find();
    res.json({jobs});
};

export const postData = async (req: Request, res: Response) => {
  // If PUT, update existing job
  if (req.method === 'PUT') {
    const { _id, title, description, requirements } = req.body;
    if (!_id) {
      return res.status(400).json({ message: 'Job _id is required for update.' });
    }
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        _id,
        { title, description, requirements },
        { new: true }
      );
      if (!updatedJob) {
        return res.status(404).json({ message: 'Job not found.' });
      }
      return res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (err) {
      return res.status(500).json({ message: 'Error updating job', error: err });
    }
  }

  // Otherwise, create new job (POST)
  console.log('postData route hit with body:', req.body);
  const { title, description, requirements, organizationName, location } = req.body;
  const newJob = new Job({ title, description, organizationName, location, requirements });
  await newJob.save();
  res.status(200).json({ message: 'Data received successfully' });
};

export const deleteJob = async (req: Request, res: Response) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ message: 'Job _id is required for deletion.' });
  }
  try {
    const deletedJob = await Job.findByIdAndDelete(_id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    return res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting job', error: err });
  }
};

export const getCandidate = async (req: Request, res: Response) => {
    const candidates = await Candidate.find();
    res.json({candidates});
};

export const reachOut = async (req: Request, res: Response) => {
  console.log('reachOut route hit with body:', req.body);

  const { _id } = req.body;
  if (!_id) {
    console.log('Missing _id, sending 400');
    return res.status(400).json({ message: 'Document _id is required.' });
  }
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      _id,
      { ReachOut: true },
      { new: true }
    );
    if (!updatedCandidate) {
      console.log('Candidate not found, sending 404');
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    console.log('ReachOut set to true, sending 200:');
    return res.status(200).json({ message: 'ReachOut set to true', candidate: updatedCandidate });
  } catch (err) {
    console.log('Error updating candidate, sending 500:', err);
    return res.status(500).json({ message: 'Error updating candidate', error: err });
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ message: 'Candidate _id is required for deletion.' });
  }
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(_id);
    if (!deletedCandidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    return res.status(200).json({ message: 'Candidate deleted successfully', candidate: deletedCandidate });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting candidate', error: err });
  }
};

export const getCallAnalysis = async (req: Request, res: Response) => {
  const { Name, Position, Organization } = req.query;
  console.log(Name, Position, Organization);
  if (!Name || !Position || !Organization) {
    return res.status(400).json({ message: 'Name, Position, and Organization are required as query parameters.' });
  }
  const query = {
    Name: { $regex: Name as string, $options: 'i' },
    Position: { $regex: Position as string, $options: 'i' },
    Organization: { $regex: Organization as string, $options: 'i' }
  };
  console.log('MongoDB query:', query);
  try {
    const result = await callAnalysis.find(query);
    console.log('MongoDB result:', result);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No call analysis data found.' });
    }
    return res.status(200).json({ callAnalysis: result });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching call analysis', error: err });
  }
};

export const postCallAnalysis = async (req: Request, res: Response) => {
  try {
    const newCallAnalysis = new callAnalysis(req.body);
    await newCallAnalysis.save();
    return res.status(201).json({ message: 'Call analysis entry created successfully', callAnalysis: newCallAnalysis });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating call analysis entry', error: err });
  }
};

