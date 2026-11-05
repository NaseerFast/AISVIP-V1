
import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const totalRes = await pool.query('SELECT COUNT(*) FROM incidents');
    const resolvedRes = await pool.query("SELECT COUNT(*) FROM incidents WHERE status = 'Resolved'");
    
    return res.status(200).json({
      success: true,
      data: {
        total: parseInt(totalRes.rows[0].count, 10),
        resolved: parseInt(resolvedRes.rows[0].count, 10)
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;