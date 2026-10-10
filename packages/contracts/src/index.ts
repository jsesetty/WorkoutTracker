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
