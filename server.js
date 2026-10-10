import app from './server/app.js';
import { PORT } from './server/config/environment.js';
import { ensureDataFiles } from './server/storage/jsonStorage.js';

// Ensure data directory and default seed files are ready
await ensureDataFiles();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`IronPulse Gym Tracker server running on http://localhost:${PORT}`);
});

export default server;
