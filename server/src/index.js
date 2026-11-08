import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Kapsy' });
});

app.listen(PORT, () => {
  console.log(`Kapsy API sur http://localhost:${PORT}`);
});
