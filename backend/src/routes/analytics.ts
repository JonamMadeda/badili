import { Router, Request, Response } from 'express';
import { logEvent, getEvents, clearEvents } from '../services/analytics';

export const analyticsRouter = Router();

analyticsRouter.post('/track', (req: Request, res: Response) => {
  const { event, metadata } = req.body;
  if (!event || typeof event !== 'string') {
    res.status(400).json({ error: 'Event name is required.' });
    return;
  }
  logEvent({
    event,
    metadata: metadata || {},
    timestamp: new Date().toISOString(),
  });
  res.status(200).json({ status: 'ok' });
});

analyticsRouter.get('/events', (_req: Request, res: Response) => {
  res.json(getEvents());
});

analyticsRouter.delete('/events', (_req: Request, res: Response) => {
  clearEvents();
  res.json({ status: 'cleared' });
});
