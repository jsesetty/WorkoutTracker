import React from 'react';
import { Box, Tabs, Tab, Button, Chip } from '@mui/material';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ToolbarCard } from './styled';
import { FilterType, WorkoutFilterCounts } from '../types/workout';

interface WorkoutToolbarProps {
  readonly filter: FilterType;
  readonly onFilterChange: (filter: FilterType) => void;
  readonly counts: WorkoutFilterCounts;
  readonly onClearCompleted: () => void;
  readonly onOpenAIModal?: () => void;
}

export const WorkoutToolbar: React.FC<WorkoutToolbarProps> = ({
  filter,
  onFilterChange,
  counts,
  onClearCompleted,
  onOpenAIModal,
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: FilterType) => {
    onFilterChange(newValue);
  };

  return (
    <ToolbarCard>
      {/* Session Filter Tabs */}
      <Tabs
        value={filter}
        onChange={handleChange}
        aria-label="Workout Session Filters"
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          p: 0.25,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tab
          value="all"
          id="filter-all-tab"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <span>ALL</span>
              <Chip
                label={counts.all}
                size="small"
                sx={{ height: 18, fontSize: '0.68rem', fontWeight: 600 }}
              />
            </Box>
          }
        />

        <Tab
          value="active"
          id="filter-active-tab"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <span>PLANNED</span>
              <Chip
                label={counts.active}
                size="small"
                sx={{ height: 18, fontSize: '0.68rem', fontWeight: 600 }}
              />
            </Box>
          }
        />

        <Tab
          value="completed"
          id="filter-completed-tab"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <span>FINISHED</span>
              <Chip
                label={counts.completed}
                size="small"
                sx={{ height: 18, fontSize: '0.68rem', fontWeight: 600 }}
              />
            </Box>
          }
        />
      </Tabs>

      {/* Actions Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
        {onOpenAIModal && (
          <Button
            id="open-ai-modal-btn"
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={onOpenAIModal}
            sx={{
              fontSize: '0.75rem',
              borderRadius: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
            }}
          >
            ⚡ AI QUICK LOG
          </Button>
        )}

        <Button
          id="clear-completed-btn"
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<DeleteSweepOutlinedIcon />}
          disabled={counts.completed === 0}
          onClick={onClearCompleted}
          sx={{
            fontSize: '0.75rem',
            borderRadius: '8px',
            fontFamily: "'Space Grotesk', sans-serif",
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'error.main',
              color: 'error.main',
            },
          }}
        >
          CLEAR FINISHED ({counts.completed})
        </Button>
      </Box>
    </ToolbarCard>
  );
};

export const RadarToolbar = WorkoutToolbar;
