import { z } from 'zod';

// ============================================================================
// CHECKPOINT 1: Schema Metric Adaptability (Telemetry JSONB)
// ============================================================================

export const SetTelemetryMetricsSchema = z.object({
  damperSetting: z.number().min(1).max(10).optional(),
  split500mSeconds: z.number().positive().optional(),
  split500mPace: z.string().optional(), // e.g. "1:48.5"
  heartRateAvgBpm: z.number().positive().optional(),
  heartRateMaxBpm: z.number().positive().optional(),
  caloriesBurned: z.number().nonnegative().optional(),
  restPauseSeconds: z.number().nonnegative().optional(),
  strokeRateSpm: z.number().positive().optional(),
  resistanceLevel: z.number().optional(),
  tempo: z.string().optional(), // e.g. "3-1-1-0" eccentric/pause/concentric
  customTelemetry: z.record(z.unknown()).optional(),
});

export type SetTelemetryMetrics = z.infer<typeof SetTelemetryMetricsSchema>;

// ============================================================================
// CHECKPOINT 2: Offline-First Client UUIDs & Domain Contracts
// ============================================================================

export const MuscleGroupEnum = z.enum([
  'CHEST',
  'BACK',
  'LEGS',
  'SHOULDERS',
  'ARMS',
  'CORE',
  'CARDIO',
  'FULL_BODY',
]);

export type MuscleGroup = z.infer<typeof MuscleGroupEnum>;

export const ExerciseTypeEnum = z.enum([
  'WEIGHT_REPS',
  'BODYWEIGHT_REPS',
  'DISTANCE_TIME',
  'TIME_ONLY',
]);

export type ExerciseType = z.infer<typeof ExerciseTypeEnum>;

export const IntensityLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type IntensityLevel = z.infer<typeof IntensityLevelEnum>;

// Canonical Exercise Catalog Model
export const ExerciseCatalogItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  muscleGroup: MuscleGroupEnum,
  type: ExerciseTypeEnum.default('WEIGHT_REPS'),
  equipment: z.string().optional(),
  defaultMetrics: SetTelemetryMetricsSchema.optional(),
});

export type ExerciseCatalogItem = z.infer<typeof ExerciseCatalogItemSchema>;

// Exercise Set Model (Enforces Client-Generated UUID)
export const ExerciseSetSchema = z.object({
  id: z.string().uuid({ message: 'Set ID must be a client-generated UUID' }),
  workoutExerciseId: z.string().uuid(),
  setIndex: z.number().int().min(1),
  reps: z.number().int().nonnegative().optional(),
  weightKg: z.number().nonnegative().optional(),
  distanceMeters: z.number().nonnegative().optional(),
  durationSeconds: z.number().nonnegative().optional(),
  rpe: z.number().min(1).max(10).optional(),
  completed: z.boolean().default(false),
  metrics: SetTelemetryMetricsSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ExerciseSetDTO = z.infer<typeof ExerciseSetSchema>;

// Workout Exercise Model
export const WorkoutExerciseSchema = z.object({
  id: z.string().uuid({ message: 'Exercise ID must be a client-generated UUID' }),
  workoutSessionId: z.string().uuid(),
  exerciseCatalogId: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  notes: z.string().optional(),
  sets: z.array(ExerciseSetSchema).default([]),
});

export type WorkoutExerciseDTO = z.infer<typeof WorkoutExerciseSchema>;

// Workout Session Model
export const WorkoutSessionSchema = z.object({
  id: z.string().uuid({ message: 'Session ID must be a client-generated UUID' }),
  userId: z.string().uuid(),
  title: z.string().min(1, 'Session title required'),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  rpeRating: z.number().int().min(1).max(10).optional(),
  overallNotes: z.string().optional(),
  intensity: IntensityLevelEnum.default('MEDIUM'),
  completed: z.boolean().default(false),
  exercises: z.array(WorkoutExerciseSchema).default([]),
  updatedAt: z.string().datetime(),
});

export type WorkoutSessionDTO = z.infer<typeof WorkoutSessionSchema>;

// Idempotent Sync Batch Payload
export const SyncBatchPayloadSchema = z.object({
  clientSyncTimestamp: z.string().datetime(),
  sessions: z.array(WorkoutSessionSchema),
  exercises: z.array(WorkoutExerciseSchema),
  sets: z.array(ExerciseSetSchema),
});

export type SyncBatchPayload = z.infer<typeof SyncBatchPayloadSchema>;

export const SyncBatchResponseSchema = z.object({
  success: z.boolean(),
  syncedSessionCount: z.number().int(),
  syncedExerciseCount: z.number().int(),
  syncedSetCount: z.number().int(),
  serverTimestamp: z.string().datetime(),
});

export type SyncBatchResponse = z.infer<typeof SyncBatchResponseSchema>;

// ============================================================================
// CHECKPOINT 3: LLM Structured Output Grounding Pipeline Contracts
// ============================================================================

// Pass 1: Extraction Output
export const LLMParsedSetSchema = z.object({
  setIndex: z.number().int().min(1),
  reps: z.number().int().optional(),
  weightKg: z.number().optional(),
  distanceMeters: z.number().optional(),
  durationSeconds: z.number().optional(),
  metrics: SetTelemetryMetricsSchema.optional(),
});

export const LLMCandidateCatalogMatchSchema = z.object({
  catalogId: z.string().uuid(),
  name: z.string(),
  muscleGroup: MuscleGroupEnum,
  confidenceScore: z.number().min(0).max(1),
});

// Pass 2: Grounded Entity Result
export const LLMParsedExerciseItemSchema = z.object({
  rawInputString: z.string(),
  matchedCatalogId: z.string().uuid().optional(),
  matchedCatalogName: z.string().optional(),
  confidenceScore: z.number().min(0).max(1),
  needsUserConfirmation: z.boolean(), // True if confidenceScore < 0.85
  suggestedCandidates: z.array(LLMCandidateCatalogMatchSchema).optional(),
  sets: z.array(LLMParsedSetSchema),
});

export const NaturalLanguageParseRequestSchema = z.object({
  rawTranscript: z.string().min(3, 'Workout transcript too short'),
  userWeightKg: z.number().positive().optional(),
});

export const NaturalLanguageParseResponseSchema = z.object({
  extractedTitle: z.string(),
  exercises: z.array(LLMParsedExerciseItemSchema),
  overallConfidence: z.number().min(0).max(1),
});

export type NaturalLanguageParseRequest = z.infer<typeof NaturalLanguageParseRequestSchema>;
export type NaturalLanguageParseResponse = z.infer<typeof NaturalLanguageParseResponseSchema>;

// ============================================================================
// CHECKPOINT 4: Food Intelligence & Barcode Contracts
// ============================================================================

export const AdditiveRiskEnum = z.enum(['None', 'Low', 'Moderate', 'Hazardous']);
export type AdditiveRisk = z.infer<typeof AdditiveRiskEnum>;

export const AdditiveInfoSchema = z.object({
  code: z.string(),
  name: z.string(),
  risk: AdditiveRiskEnum,
  description: z.string().optional(),
});
export type AdditiveInfo = z.infer<typeof AdditiveInfoSchema>;

export const YukaRatingEnum = z.enum(['Excellent', 'Good', 'Mediocre', 'Bad']);
export type YukaRating = z.infer<typeof YukaRatingEnum>;

export const FoodItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  servingSize: z.string().default('100g'),
  yukaScore: z.number().min(0).max(100),
  yukaRating: YukaRatingEnum,
  additives: z.array(AdditiveInfoSchema).default([]),
  novaGroup: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(1),
  isOrganic: z.boolean().default(false),
  cleanAlternativeId: z.string().optional(),
  cleanAlternativeName: z.string().optional(),
});
export type FoodItemDTO = z.infer<typeof FoodItemSchema>;

export const BarcodeLookupResponseSchema = z.object({
  found: z.boolean(),
  source: z.enum(['local_cache', 'open_food_facts']),
  product: FoodItemSchema.optional(),
  error: z.string().optional(),
});
export type BarcodeLookupResponse = z.infer<typeof BarcodeLookupResponseSchema>;

// ============================================================================
// CHECKPOINT 5: Authentication & Session Contracts
// ============================================================================

export const UserRoleEnum = z.enum(['ATHLETE', 'COACH', 'ADMIN']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const AuthCredentialsSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type AuthCredentials = z.infer<typeof AuthCredentialsSchema>;

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleEnum.default('ATHLETE'),
  createdAt: z.string().optional(),
});
export type AuthUserDTO = z.infer<typeof AuthUserSchema>;

export const AuthSessionStateSchema = z.object({
  isAuthenticated: z.boolean(),
  user: AuthUserSchema.nullable(),
  provider: z.enum(['supabase', 'demo', 'guest']),
});
export type AuthSessionState = z.infer<typeof AuthSessionStateSchema>;

