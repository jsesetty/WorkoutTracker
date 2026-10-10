import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fsSync from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root workspace directory: 2 levels up from server/config
export const rootDir = path.resolve(__dirname, '..', '..');

export const PORT = process.env.PORT || 3000;

export const DATA_DIR = path.join(rootDir, 'data');
export const DATA_FILE_WORKOUTS = path.join(DATA_DIR, 'workouts.json');
export const LEGACY_DATA_FILE = path.join(DATA_DIR, 'todos.json');
export const DATA_FILE_MEALS = path.join(DATA_DIR, 'meals.json');
export const DATA_FILE_FOODS = path.join(DATA_DIR, 'foods.json');
export const DATA_FILE_GOALS = path.join(DATA_DIR, 'nutrition_goals.json');
export const DATA_FILE_CATALOG = path.join(DATA_DIR, 'catalog.json');
export const DATA_FILE_SESSIONS = path.join(DATA_DIR, 'sessions.json');

export const distPath = fsSync.existsSync(path.join(rootDir, 'apps', 'web', 'dist'))
  ? path.join(rootDir, 'apps', 'web', 'dist')
  : path.join(rootDir, 'dist');

export const publicPath = fsSync.existsSync(path.join(rootDir, 'apps', 'web', 'public'))
  ? path.join(rootDir, 'apps', 'web', 'public')
  : path.join(rootDir, 'public');

export const staticPath = fsSync.existsSync(distPath) ? distPath : publicPath;
