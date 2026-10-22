import express from 'express';

// Reusable validation helper — pass the field names that must be present, non-empty strings
export function requireStringFields(fields: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (const field of fields) {
      if (typeof req.body[field] !== 'string' || req.body[field].trim() === '') {
        return res.status(400).json({ error: `Missing or invalid field: ${field}` });
      }
    }
    next();
  };
}

export function requireFields(fields: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (const field of fields) {
      const value = req.body[field];
      const isMissing = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
      if (isMissing) {
        return res.status(400).json({ error: `Missing or invalid field: ${field}` });
      }
    }
    next();
  };
}

