import { Request, Response } from 'express';
import { IncidentService } from '../services/incident.service';

export const createIncidentHandler = async (req: Request, res: Response) => {
  try {
    const incident = await IncidentService.createIncident(req.body);
    return res.status(201).json({ success: true, data: incident });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const listIncidentsHandler = async (req: Request, res: Response) => {
  try {
    const incidents = await IncidentService.getIncidents(req.query);
    return res.status(200).json({ success: true, data: incidents });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateStatusHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, updatedBy, notes } = req.body;
    const updated = await IncidentService.updateStatus(id, status, updatedBy || 'System User', notes);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
};