import express from 'express';
import expressWinston from 'express-winston';
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import ordersRoutes from './routes/orders';
import { logger } from './utils/logger';
import mongoose from 'mongoose';
import { httpRequestDuration, register } from './utils/metrics';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      meta: true,
    })
  );

  app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
      end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
    });
    next();
  });

  app.use('/auth', authRoutes);
  app.use('/services', servicesRoutes);
  app.use('/orders', ordersRoutes);

  app.get('/healthz', (_, res) => res.json({ status: 'ok' }));
  app.get('/readyz', (_, res) => {
    const ready = mongoose.connection.readyState === 1;
    const status = ready ? 200 : 500;
    res.status(status).json({ ready });
  });
  app.get('/metrics', async (_, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app.use(expressWinston.errorLogger({ winstonInstance: logger }));

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ message: (err as Error).message });
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 4000;
  createApp().listen(port, () => {
    logger.info(`API listening on port ${port}`);
  });
}
