import express from 'express';
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import ordersRoutes from './routes/orders';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRoutes);
  app.use('/services', servicesRoutes);
  app.use('/orders', ordersRoutes);
  app.get('/healthz', (_, res) => res.json({ status: 'ok' }));
  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 4000;
  createApp().listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}
