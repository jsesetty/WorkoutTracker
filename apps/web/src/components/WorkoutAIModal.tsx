import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {
  NaturalLanguageParseResponse,
  LLMParsedExerciseItemSchema,
} from '@ironpulse/contracts';
import { MuscleGroup, IntensityLevel, WorkoutItem, WorkoutSet } from '../types/workout';
import { generateClientUUID } from '../lib/offlineDb';

interface WorkoutAIModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCommitExercises: (workouts: WorkoutItem[]) => void;
  readonly onShowNotification: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

type ParsedExerciseItem = typeof LLMParsedExerciseItemSchema._type;

export const WorkoutAIModal: React.FC<WorkoutAIModalProps> = ({
  open,
  onClose,
  onCommitExercises,
  onShowNotification,
}) => {
  const [transcript, setTranscript] = useState<string>(
    'Rowed 2000m in 7:15, then 4 sets of 15 wall balls with 20lb ball, then 3 sets of 10 flat bench press at 85kg'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<NaturalLanguageParseResponse | null>(null);

  const handleParse = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/ai/parse-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawTranscript: transcript.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to parse workout transcript');
      }

      const data: NaturalLanguageParseResponse = await res.json();
      setParsedResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI parsing service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleRebindExercise = (exerciseIndex: number, newCatalogName: string, newCatalogId: string) => {
    if (!parsedResult) return;
    const updatedExercises = [...parsedResult.exercises];
    const target = updatedExercises[exerciseIndex];
    if (!target) return;

    updatedExercises[exerciseIndex] = {
      ...target,
      matchedCatalogName: newCatalogName,
      matchedCatalogId: newCatalogId,
      confidenceScore: 0.99,
      needsUserConfirmation: false,
    };

    setParsedResult({
      ...parsedResult,
      exercises: updatedExercises,
    });
  };

  const handleCommit = () => {
    if (!parsedResult || parsedResult.exercises.length === 0) return;

    const newWorkouts: WorkoutItem[] = parsedResult.exercises.map((ex) => {
      const workoutId = generateClientUUID();
      const resolvedTitle = ex.matchedCatalogName || ex.rawInputString;

      const sets: WorkoutSet[] = (ex.sets || []).map((s, idx) => ({
        id: generateClientUUID(),
        setNumber: s.setIndex || idx + 1,
        reps: s.reps || 10,
        weight: s.weightKg ? `${s.weightKg} kg` : (s.distanceMeters ? `${s.distanceMeters}m` : ''),
        completed: false,
      }));

      // Map catalog to muscle group
      let muscleGroup: MuscleGroup = 'Full Body';
      const nameLower = resolvedTitle.toLowerCase();
      if (nameLower.includes('bench') || nameLower.includes('chest')) muscleGroup = 'Chest';
      else if (nameLower.includes('row') || nameLower.includes('deadlift') || nameLower.includes('pull')) muscleGroup = 'Back';
      else if (nameLower.includes('squat') || nameLower.includes('leg')) muscleGroup = 'Legs';
      else if (nameLower.includes('press') || nameLower.includes('shoulder')) muscleGroup = 'Shoulders';
      else if (nameLower.includes('curl') || nameLower.includes('tricep')) muscleGroup = 'Arms';
      else if (nameLower.includes('rowing') || nameLower.includes('bike')) muscleGroup = 'Cardio';

      const intensity: IntensityLevel = ex.confidenceScore >= 0.85 ? 'high' : 'medium';

      return {
        id: workoutId,
        title: resolvedTitle,
        muscleGroup,
        intensity,
        sets: sets.length > 0 ? sets.length : 3,
        reps: sets.length > 0 ? sets[0].reps : 10,
        weight: sets.length > 0 ? sets[0].weight : '',
        setDetails: sets,
        completed: false,
        createdAt: new Date().toISOString(),
        notes: `AI Grounded (${Math.round(ex.confidenceScore * 100)}% match)`,
      };
    });

    onCommitExercises(newWorkouts);
    onShowNotification(`Logged ${newWorkouts.length} AI-parsed movements to active session! 🔥`, 'success');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon color="primary" />
        <Typography component="span" variant="h6" sx={{ fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          AI NATURAL LANGUAGE WORKOUT PARSER
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Paste or type your training notes, whiteboard splits, or voice transcript. The two-pass pipeline extracts loads, reps, distance, and grounds raw names against the verified catalog.
        </Typography>

        <TextField
          id="ai-transcript-input"
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="e.g. 4 sets of 10 barbell bench press at 80kg, then rowed 2000m in 7:15..."
          variant="outlined"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        />

        {error && <Alert severity="error">{error}</Alert>}

        {parsedResult && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                PARSED EXTRACTED MOVEMENTS ({parsedResult.exercises.length})
              </Typography>
              <Chip
                label={`PIPELINE CONFIDENCE: ${Math.round(parsedResult.overallConfidence * 100)}%`}
                size="small"
                color={parsedResult.overallConfidence >= 0.85 ? 'success' : 'warning'}
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
              />
            </Box>

            {parsedResult.exercises.map((ex: ParsedExerciseItem, idx: number) => {
              const isHighConfidence = ex.confidenceScore >= 0.85;
              return (
                <Box
                  key={`${ex.rawInputString}-${idx}`}
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: isHighConfidence ? 'divider' : 'warning.main',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FitnessCenterIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {ex.matchedCatalogName || ex.rawInputString}
                      </Typography>
                    </Box>

                    <Chip
                      id={`confidence-chip-${idx}`}
                      icon={isHighConfidence ? <CheckCircleOutlineIcon fontSize="small" /> : <WarningAmberIcon fontSize="small" />}
                      label={isHighConfidence ? `VERIFIED (${Math.round(ex.confidenceScore * 100)}%)` : `CONFIRM MOVEMENT (${Math.round(ex.confidenceScore * 100)}%)`}
                      size="small"
                      color={isHighConfidence ? 'success' : 'warning'}
                      sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Raw athlete transcript: &ldquo;{ex.rawInputString}&rdquo; • Sets: {ex.sets.length}
                  </Typography>

                  {ex.needsUserConfirmation && ex.suggestedCandidates && ex.suggestedCandidates.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Select canonical match:
                      </Typography>
                      {ex.suggestedCandidates.map((cand) => (
                        <Chip
                          key={cand.catalogId}
                          label={cand.name}
                          size="small"
                          variant="outlined"
                          clickable
                          onClick={() => handleRebindExercise(idx, cand.name, cand.catalogId)}
                          sx={{ fontSize: '0.68rem', cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          CANCEL
        </Button>
        <Button
          id="ai-parse-btn"
          variant="outlined"
          color="primary"
          startIcon={loading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          onClick={handleParse}
          disabled={loading || !transcript.trim()}
          sx={{ fontWeight: 700 }}
        >
          {loading ? 'PARSING...' : 'PARSE TRANSCRIPT'}
        </Button>
        {parsedResult && parsedResult.exercises.length > 0 && (
          <Button
            id="ai-commit-btn"
            variant="contained"
            color="primary"
            onClick={handleCommit}
            sx={{ fontWeight: 700 }}
          >
            LOG ALL TO ACTIVE SESSION
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
