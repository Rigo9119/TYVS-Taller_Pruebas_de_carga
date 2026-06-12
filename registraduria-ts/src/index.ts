import { createApp } from './app';

const PORT = Number(process.env.PORT) || 8080;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Registraduría running on http://localhost:${PORT}`);
});
