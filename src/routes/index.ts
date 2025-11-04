import { Router } from 'express';
import { getData, postData, deleteJob, getCandidate, reachOut, deleteCandidate, getCallAnalysis, postCallAnalysis, registerUser, loginUser } from '../controllers/dataController';

const router = Router();

router.get('/getJobs', getData);
router.post('/sendJobs', postData);
router.put('/sendJobs', postData);
router.delete('/deleteJob', deleteJob);

router.get('/getCandidates', getCandidate);
router.post('/reachOut', reachOut);
router.delete('/deleteCandidate', deleteCandidate);
router.get('/getCallAnalysis', getCallAnalysis);
router.post('/postCallAnalysis', postCallAnalysis);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
