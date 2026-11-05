import { pool } from '../config/database';
import { analyzeIncidentWithGemini } from './gemini.service';

export class IncidentService {
  static async createIncident(data: any) {
    const { title, category, lga, community, description, latitude, longitude, phone } = data;

    // AI Triage
    const aiAnalysis = await analyzeIncidentWithGemini(title, description, category);
    const priority = aiAnalysis.priority || 'Medium';

    // Generate Incident Reference ID (e.g., AISVIP-BOR-2026-XXXXXX)
    const countRes = await pool.query('SELECT COUNT(*) FROM incidents');
    const nextNum = (parseInt(countRes.rows[0].count, 10) + 1).toString().padStart(6, '0');
    const incidentId = `AISVIP-BOR-${new Date().getFullYear()}-${nextNum}`;

    const query = `
      INSERT INTO incidents (id, title, category, lga, community, description, latitude, longitude, phone, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Submitted')
      RETURNING *;
    `;

    const values = [incidentId, title, category, lga, community, description, latitude, longitude, phone, priority];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async getIncidents(filters: any) {
    let query = 'SELECT * FROM incidents ORDER BY created_at DESC';
    const res = await pool.query(query);
    return res.rows;
  }

  static async updateStatus(id: string, status: string, updatedBy: string, notes?: string) {
    const query = `
      UPDATE incidents
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const res = await pool.query(query, [status, id]);
    return res.rows[0];
  }
}
