import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validatePDFRequest } from '../middleware/validate';
import { generatePDF } from '../services/pdfGenerator';
import { AppError } from '../middleware/errorHandler';
import { logEvent } from '../services/analytics';

export const pdfRouter = Router();

pdfRouter.post(
  '/convert',
  validatePDFRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = uuidv4();
    try {
      const { markdown, options } = req.body;
      const pdfBuffer = await generatePDF(markdown, options);

      logEvent({
        event: 'pdf_converted',
        metadata: {
          requestId,
          size: markdown.length,
          options: JSON.stringify(options),
        },
        timestamp: new Date().toISOString(),
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="badili-${requestId}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.status(200).send(pdfBuffer);
    } catch (err) {
      logEvent({
        event: 'pdf_conversion_error',
        metadata: { requestId, error: (err as Error).message },
        timestamp: new Date().toISOString(),
      });

      if (err instanceof AppError) {
        return next(err);
      }
      next(new AppError(500, 'CONVERSION_FAILED', 'Unable to generate PDF. Please try again.'));
    }
  }
);
