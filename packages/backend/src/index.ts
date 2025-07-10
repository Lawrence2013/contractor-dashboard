import express from 'express';
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import ordersRoutes from './routes/orders';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/orders', ordersRoutes);
app.get('/healthz', (_, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
