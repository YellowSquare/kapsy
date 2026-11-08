import { createApp } from './app.js';
import { createStore } from './store.js';

const PORT = process.env.PORT || 3001;

createApp(createStore()).listen(PORT, () => {
  console.log(`Kapsy API sur http://localhost:${PORT}`);
});
