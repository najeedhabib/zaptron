import express from 'express';
import { checkLeads, replyToLead, getLeads} from '../services/follow-up';

const router = express.Router();
// Wrap async handlers with error handling
router.get('/send', (req, res, next) => {
	checkLeads(req, res).catch(next);
});

router.get('/reply', (req, res, next) => {
	replyToLead(req, res).catch(next);
});

router.get('/leads', getLeads);

export default router;
