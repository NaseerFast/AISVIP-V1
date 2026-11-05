import { Router } from 'express';
import { createIncidentHandler, listIncidentsHandler, updateStatusHandler } from '../controllers/incident.controller';

const router = Router();

router.post('/', createIncidentHandler);
router.get('/', listIncidentsHandler);
router.patch('/:id/status', updateStatusHandler);

export default router;