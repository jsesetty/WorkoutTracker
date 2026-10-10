import React, { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  TextField,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  WorkoutCard,
  ExerciseTitleText,
  SetsTableContainer,
  SetsTableHeader,
  SetLogRow,
  SetIndexTag,
  RepStepperBox,
  RepCountNumber,
  WeightControlBox,
  WeightTextInput,
  SetLogCheckBtn,
  AddSetActionBtn,
  SetStepperBtn,
} from './styled';
import {
  WorkoutItem as WorkoutItemType,
  WorkoutSet,
  IntensityLevel,
} from '../types/workout';
import { useSettings } from '../context/SettingsContext';

const getIntensityDetails = (intensity?: IntensityLevel) => {
  switch (intensity) {
    case 'high':
      return { label: 'MAX EFFORT', color: '#EF4444' };
    case 'low':
      return { label: 'WARMUP', color: '#00D8F6' };
    default:
      return { label: 'MODERATE', color: '#EAB308' };
  }
};

const formatTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${Math.floor(diffHour / 24)}d ago`;
};

interface WorkoutItemProps {
  readonly workout?: WorkoutItemType;
  readonly todo?: WorkoutItemType;
  readonly onToggle: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onUpdateTitle: (id: string, newTitle: string) => void;
  readonly onAddSet?: (workoutId: string) => void;
  readonly onUpdateSet?: (workoutId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  readonly onDeleteSet?: (workoutId: string, setId: string) => void;
}

export const WorkoutItem: React.FC<WorkoutItemProps> = ({
  workout,
  todo,
  onToggle,
  onDelete,
  onUpdateTitle,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
}) => {
  const item = workout || todo;
  if (!item) return null;

  const { unit: currentUnit } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.title);

  const totalSetsCount = item.sets || (item.setDetails ? item.setDetails.length : 3);
  const defaultRepsNum =
    typeof item.reps === 'number'
      ? item.reps
      : parseInt(String(item.reps || 10), 10) || 10;

  // Local state for sets fallback (supports standalone unit tests & immediate response)
  const [localSets, setLocalSets] = useState<WorkoutSet[]>(() => {
    if (item.setDetails && item.setDetails.length > 0) {
      return item.setDetails;
    }
    return Array.from({ length: totalSetsCount }, (_, idx) => ({
      id: `${item.id}-s-${idx + 1}`,
      setNumber: idx + 1,
      reps: defaultRepsNum,
      weight: item.weight || '',
      completed: item.completed || idx < (item.completedSets || 0),
    }));
  });

  // Sync local sets when item.setDetails or item.completed changes
  useEffect(() => {
    if (item.setDetails && item.setDetails.length > 0) {
      setLocalSets(item.setDetails);
    } else {
      setLocalSets(
        Array.from({ length: item.sets || 3 }, (_, idx) => ({
          id: `${item.id}-s-${idx + 1}`,
          setNumber: idx + 1,
          reps: defaultRepsNum,
          weight: item.weight || '',
          completed: item.completed || idx < (item.completedSets || 0),
        }))
      );
    }
  }, [item.setDetails, item.sets, item.completed, defaultRepsNum, item.id, item.weight, item.completedSets]);

  const intensityMeta = getIntensityDetails(item.intensity);

  const handleCommitEdit = () => {
    if (!editValue.trim() || editValue.trim() === item.title) {
      setEditValue(item.title);
      setIsEditing(false);
      return;
    }
    onUpdateTitle(item.id, editValue.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommitEdit();
    } else if (e.key === 'Escape') {
      setEditValue(item.title);
      setIsEditing(false);
    }
  };

  const handleToggleSet = (setId: string) => {
    const targetSet = localSets.find((s) => s.id === setId);
    if (!targetSet) return;
    const nextCompleted = !targetSet.completed;

    if (onUpdateSet) {
      onUpdateSet(item.id, setId, { completed: nextCompleted });
    } else {
      const updated = localSets.map((s) =>
        s.id === setId ? { ...s, completed: nextCompleted } : s
      );
      setLocalSets(updated);
      const allDone = updated.every((s) => s.completed);
      if (allDone !== item.completed) {
        onToggle(item.id);
      }
    }
  };

  const handleAdjustReps = (setId: string, delta: number) => {
    const targetSet = localSets.find((s) => s.id === setId);
    if (!targetSet) return;
    const nextReps = Math.max(1, Math.min(100, targetSet.reps + delta));

    if (onUpdateSet) {
      onUpdateSet(item.id, setId, { reps: nextReps });
    } else {
      setLocalSets((prev) =>
        prev.map((s) => (s.id === setId ? { ...s, reps: nextReps } : s))
      );
    }
  };

  const handleUpdateWeight = (setId: string, newWeight: string) => {
    if (onUpdateSet) {
      onUpdateSet(item.id, setId, { weight: newWeight });
    } else {
      setLocalSets((prev) =>
        prev.map((s) => (s.id === setId ? { ...s, weight: newWeight } : s))
      );
    }
  };

  const handleAdjustWeight = (setId: string, delta: number) => {
    const targetSet = localSets.find((s) => s.id === setId);
    if (!targetSet) return;
    const currentWeightStr = targetSet.weight || item.weight || '0';
    const num = parseFloat(currentWeightStr.replace(/[^0-9.]/g, '')) || 0;
    const unitMatch = currentWeightStr.match(/[a-zA-Z]+/);
    const activeUnit = unitMatch ? unitMatch[0] : currentUnit;
    const effectiveDelta = activeUnit === 'lbs' && Math.abs(delta) === 2.5 ? (delta > 0 ? 5 : -5) : delta;
    const nextVal = Math.max(0, Math.round((num + effectiveDelta) * 10) / 10);
    const formatted = `${nextVal} ${activeUnit}`;

    if (onUpdateSet) {
      onUpdateSet(item.id, setId, { weight: formatted });
    } else {
      setLocalSets((prev) =>
        prev.map((s) => (s.id === setId ? { ...s, weight: formatted } : s))
      );
    }
  };

  const handleAddSetClick = () => {
    if (onAddSet) {
      onAddSet(item.id);
    } else {
      const nextNum = localSets.length + 1;
      const lastReps =
        localSets.length > 0 ? localSets[localSets.length - 1].reps : defaultRepsNum;
      const newSet: WorkoutSet = {
        id: `${item.id}-s-${Date.now()}-${nextNum}`,
        setNumber: nextNum,
        reps: lastReps,
        completed: false,
      };
      setLocalSets((prev) => [...prev, newSet]);
    }
  };

  const handleDeleteSetClick = (setId: string) => {
    if (localSets.length <= 1) return;
    if (onDeleteSet) {
      onDeleteSet(item.id, setId);
    } else {
      setLocalSets((prev) =>
        prev
          .filter((s) => s.id !== setId)
          .map((s, idx) => ({ ...s, setNumber: idx + 1 }))
      );
    }
  };

  const completedSetsCount = localSets.filter((s) => s.completed).length;

  return (
    <WorkoutCard
      elevation={0}
      id={`todo-item-${item.id}`}
      borderColor={intensityMeta.color}
      completed={item.completed}
    >
      {/* Exercise Card Header: Title, Tags, and Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1.5,
          width: '100%',
        }}
      >
        {/* Left: Title & Badges */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleCommitEdit}
              onKeyDown={handleKeyDown}
              inputProps={{ 'aria-label': 'Edit exercise title' }}
            />
          ) : (
            <ExerciseTitleText
              variant="body1"
              id={`title-${item.id}`}
              completed={item.completed}
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit exercise"
            >
              {item.title}
            </ExerciseTitleText>
          )}

          {/* Metadata Badges */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              flexWrap: 'wrap',
              mt: 0.75,
            }}
          >
            {item.muscleGroup && (
              <Chip
                label={item.muscleGroup.toUpperCase()}
                size="small"
                variant="outlined"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  borderColor: 'divider',
                  color: 'text.secondary',
                }}
              />
            )}

            <Chip
              label={intensityMeta.label}
              size="small"
              variant="outlined"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                borderColor: `${intensityMeta.color}40`,
                color: intensityMeta.color,
              }}
            />

            <Chip
              label={`${item.sets || localSets.length} SETS`}
              size="small"
              variant="outlined"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                borderColor: 'divider',
                color: 'text.secondary',
              }}
            />

            {item.completed && (
              <Chip
                label="CONQUERED"
                size="small"
                color="success"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, borderRadius: '2px' }}
              />
            )}
          </Box>
        </Box>

        {/* Right: Completion Toggle, Edit, Delete */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {/* Main Exercise Completion Checkbox (preserved for test contracts & quick mark all) */}
          <Tooltip title={item.completed ? 'Mark exercise active' : 'Complete all sets'}>
            <Checkbox
              checked={item.completed}
              onChange={() => onToggle(item.id)}
              icon={
                <RadioButtonUncheckedIcon
                  sx={{ color: 'text.secondary', fontSize: '1.25rem' }}
                />
              }
              checkedIcon={
                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: '1.25rem' }} />
              }
              id={`checkbox-${item.id}`}
              sx={{ p: 0.4 }}
            />
          </Tooltip>

          <Tooltip title="Edit exercise">
            <IconButton
              size="small"
              id={`edit-btn-${item.id}`}
              onClick={() => setIsEditing(!isEditing)}
              sx={{ color: 'text.secondary' }}
            >
              <EditOutlinedIcon sx={{ fontSize: '1.05rem' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Remove exercise">
            <IconButton
              size="small"
              id={`delete-btn-${item.id}`}
              onClick={() => onDelete(item.id)}
              aria-label="Remove exercise"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: '1.15rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sets & Reps Training Log Table */}
      <SetsTableContainer>
        <SetsTableHeader>
          <span>SET</span>
          <span>WEIGHT</span>
          <span>REPS</span>
          <span style={{ textAlign: 'center' }}>LOG</span>
        </SetsTableHeader>

        {localSets.map((set) => (
          <SetLogRow key={set.id} completed={set.completed}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <SetIndexTag>#{set.setNumber}</SetIndexTag>
              {localSets.length > 1 && (
                <Tooltip title={`Remove set ${set.setNumber}`}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSetClick(set.id)}
                    aria-label={`Remove set ${set.setNumber}`}
                    sx={{
                      p: 0.1,
                      color: 'text.secondary',
                      opacity: 0.4,
                      '&:hover': { opacity: 1, color: 'error.main' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '0.75rem' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Hybrid Weight Control: Editable Input + Stepper */}
            <WeightControlBox>
              <SetStepperBtn
                type="button"
                onClick={() => handleAdjustWeight(set.id, currentUnit === 'lbs' ? -5 : -2.5)}
                aria-label={`Decrease weight for set ${set.setNumber}`}
              >
                -
              </SetStepperBtn>
              <WeightTextInput
                value={set.weight || ''}
                placeholder={`0 ${currentUnit}`}
                onChange={(e) => handleUpdateWeight(set.id, e.target.value)}
                aria-label={`Weight for set ${set.setNumber}`}
              />
              <SetStepperBtn
                type="button"
                onClick={() => handleAdjustWeight(set.id, currentUnit === 'lbs' ? 5 : 2.5)}
                aria-label={`Increase weight for set ${set.setNumber}`}
              >
                +
              </SetStepperBtn>
            </WeightControlBox>

            <RepStepperBox>
              <SetStepperBtn
                type="button"
                onClick={() => handleAdjustReps(set.id, -1)}
                aria-label={`Decrease reps for set ${set.setNumber}`}
              >
                -
              </SetStepperBtn>
              <RepCountNumber>{set.reps} REPS</RepCountNumber>
              <SetStepperBtn
                type="button"
                onClick={() => handleAdjustReps(set.id, 1)}
                aria-label={`Increase reps for set ${set.setNumber}`}
              >
                +
              </SetStepperBtn>
            </RepStepperBox>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip
                title={set.completed ? 'Set completed' : `Log Set ${set.setNumber}`}
              >
                <SetLogCheckBtn
                  type="button"
                  completed={set.completed}
                  onClick={() => handleToggleSet(set.id)}
                  aria-label={`Log set ${set.setNumber}`}
                >
                  <CheckIcon
                    sx={{
                      fontSize: '1rem',
                      color: set.completed ? '#FFFFFF' : 'text.secondary',
                      opacity: set.completed ? 1 : 0.4,
                    }}
                  />
                </SetLogCheckBtn>
              </Tooltip>
            </Box>
          </SetLogRow>
        ))}

        {/* Table Footer: Add Set Button & Session Summary */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            pt: 0.5,
          }}
        >
          <AddSetActionBtn
            type="button"
            startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={handleAddSetClick}
            aria-label="Add working set"
          >
            ADD SET
          </AddSetActionBtn>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {completedSetsCount} / {localSets.length} sets completed
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.68rem',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {formatTime(item.createdAt)}
            </Typography>
          </Box>
        </Box>
      </SetsTableContainer>
    </WorkoutCard>
  );
};

export const TaskItem = WorkoutItem;

