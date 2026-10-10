import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, Container, Button } from '@mui/material';

export const AppShell = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100%',
  overflowX: 'hidden',
  boxSizing: 'border-box',
  backgroundColor: theme.palette.background.default,
  transition: 'background-color 0.12s ease-out',
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(3),
  },
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const HeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.25, 2),
  borderRadius: '4px',
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  gap: theme.spacing(1),
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 1),
    gap: theme.spacing(0.5),
  },
}));

export const BrandGroup = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
  flexShrink: 0,
});

export const BrandLogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
});

export const BrandTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 800,
  letterSpacing: '0',
  fontFamily: "var(--font-brand, 'Syne', sans-serif)",
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  lineHeight: 1.1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.15rem',
  },
}));

export const NavLinksGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  overflowX: 'auto',
  flexWrap: 'nowrap',
  whiteSpace: 'nowrap',
  width: '100%',
  paddingBottom: '2px',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: '0.78rem',
  fontWeight: 700,
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  letterSpacing: '0.03em',
  padding: '6px 12px',
  borderRadius: '4px',
  textTransform: 'uppercase',
  flexShrink: 0,
  color: active ? '#FF5500' : theme.palette.text.secondary,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 85, 0, 0.12)'
      : 'rgba(255, 85, 0, 0.08)'
    : 'transparent',
  border: `1px solid ${active ? 'rgba(255, 85, 0, 0.35)' : theme.palette.divider}`,
  transition: 'all 0.1s ease-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.04)',
    color: '#FF5500',
    borderColor: '#FF5500',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.72rem',
    padding: '5px 10px',
  },
}));

export const MeterCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isMax',
})<{ isMax?: boolean }>(({ theme, isMax }) => ({
  padding: theme.spacing(2.25),
  borderRadius: '4px',
  border: isMax
    ? '1px solid #059669'
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
}));

export const HudMetricPod = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 1.25),
  borderRadius: '4px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? '#181D26'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${theme.palette.divider}`,
}));

export const InputCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1.25),
  },
}));

export const ToolbarCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const WorkoutCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'borderColor' && prop !== 'completed',
})<{ borderColor: string; completed?: boolean }>(({ theme, borderColor, completed }) => ({
  padding: theme.spacing(1.75, 2),
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: `3px solid ${borderColor}`,
  opacity: completed ? 0.85 : 1,
  backgroundColor: completed
    ? theme.palette.mode === 'dark'
      ? '#111A17'
      : '#F4FBF7'
    : theme.palette.mode === 'dark'
      ? '#12151B'
      : theme.palette.background.paper,
  boxShadow: 'none',
  transition: 'border-color 0.1s ease-out, background-color 0.1s ease-out',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.22)' : '#94A3B8',
    borderLeftColor: borderColor,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 1.25),
  },
}));

export const ExerciseTitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  fontSize: '1.05rem',
  fontWeight: 700,
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  letterSpacing: '-0.02em',
  color: completed ? theme.palette.text.secondary : theme.palette.text.primary,
  textDecoration: 'none',
  wordBreak: 'break-word',
  cursor: 'pointer',
  lineHeight: 1.35,
}));

export const SetsTableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginTop: theme.spacing(1),
  borderRadius: '4px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? '#181D26'
      : '#F8FAFC',
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.25),
}));

export const SetsTableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '46px 1fr 1fr 40px',
  alignItems: 'center',
  padding: '6px 8px',
  color: theme.palette.text.secondary,
  fontSize: '0.68rem',
  fontWeight: 700,
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  letterSpacing: '0.05em',
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: '6px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '32px 1fr 1fr 36px',
    padding: '4px 4px',
    gap: '4px',
  },
}));

export const SetLogRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  display: 'grid',
  gridTemplateColumns: '46px 1fr 1fr 40px',
  alignItems: 'center',
  padding: '6px 8px',
  gap: '6px',
  borderRadius: '2px',
  backgroundColor: completed
    ? theme.palette.mode === 'dark'
      ? 'rgba(5, 150, 105, 0.12)'
      : 'rgba(5, 150, 105, 0.08)'
    : 'transparent',
  border: `1px solid ${completed ? 'rgba(5, 150, 105, 0.35)' : 'transparent'}`,
  transition: 'all 0.1s ease-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.03)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '32px 1fr 1fr 36px',
    padding: '5px 4px',
    gap: '4px',
  },
}));

export const SetIndexTag = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
  fontSize: '0.75rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
  },
}));

export const RepStepperBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  padding: '2px 4px',
  borderRadius: '2px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : '#FFFFFF',
  width: '100%',
  minWidth: 0,
}));

export const RepCountNumber = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
  fontSize: '0.78rem',
  fontWeight: 700,
  minWidth: '40px',
  textAlign: 'center',
  color: theme.palette.text.primary,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.72rem',
    minWidth: '30px',
  },
}));

export const WeightControlBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  padding: '2px 4px',
  borderRadius: '2px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : '#FFFFFF',
  width: '100%',
  minWidth: 0,
}));

export const WeightTextInput = styled('input')(({ theme }) => ({
  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
  fontSize: '0.78rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  textAlign: 'center',
  width: '100%',
  minWidth: 0,
  maxWidth: '52px',
  padding: '2px 0',
  fontVariantNumeric: 'tabular-nums',
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.6,
  },
  [theme.breakpoints.down('sm')]: {
    width: '44px',
    fontSize: '0.72rem',
  },
}));

export const SetLogCheckBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  border: completed
    ? '1px solid #059669'
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: completed
    ? '#059669'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  color: completed ? '#FFFFFF' : theme.palette.text.secondary,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.1s ease-out',
  '&:hover': {
    borderColor: completed ? '#059669' : '#FF5500',
    backgroundColor: completed ? '#047857' : 'rgba(255, 85, 0, 0.12)',
    color: completed ? '#FFFFFF' : '#FF5500',
  },
  [theme.breakpoints.down('sm')]: {
    width: '28px',
    height: '28px',
  },
}));

export const AddSetActionBtn = styled(Button)(({ theme }) => ({
  fontSize: '0.72rem',
  fontWeight: 700,
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  letterSpacing: '0.04em',
  padding: '4px 10px',
  borderRadius: '4px',
  border: `1px dashed ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  alignSelf: 'flex-start',
  marginTop: '4px',
  textTransform: 'uppercase',
  '&:hover': {
    borderColor: '#FF5500',
    color: '#FF5500',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 85, 0, 0.08)'
        : 'rgba(255, 85, 0, 0.05)',
  },
}));

export const MusclePillButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  border: active
    ? '1px solid #FF5500'
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 85, 0, 0.12)'
      : 'rgba(255, 85, 0, 0.08)'
    : 'transparent',
  color: active ? '#FF5500' : theme.palette.text.secondary,
  borderRadius: '2px',
  padding: '4px 10px',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.72rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textTransform: 'uppercase',
  transition: 'all 0.1s ease-out',
  '&:hover': {
    color: theme.palette.text.primary,
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : '#9CA3AF',
  },
}));

export const IntensityToggleBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'accentColor',
})<{ active?: boolean; accentColor: string }>(({ theme, active, accentColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  border: active
    ? `1px solid ${accentColor}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: active
    ? `${accentColor}18`
    : 'transparent',
  color: active ? accentColor : theme.palette.text.secondary,
  borderRadius: '2px',
  padding: '5px 10px',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.72rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.1s ease-out',
  '&:hover': {
    color: accentColor,
    borderColor: accentColor,
  },
}));

export const SetStepperBtn = styled('button')(({ theme }) => ({
  width: '24px',
  height: '24px',
  flexShrink: 0,
  borderRadius: '2px',
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontWeight: 600,
  fontSize: '0.85rem',
  transition: 'all 0.1s ease-out',
  '&:hover': {
    borderColor: '#FF5500',
    color: '#FF5500',
  },
  [theme.breakpoints.down('sm')]: {
    width: '20px',
    height: '20px',
    fontSize: '0.8rem',
  },
}));

export const PresetExerciseChip = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? '#181D26'
      : 'rgba(0, 0, 0, 0.02)',
  color: theme.palette.text.secondary,
  borderRadius: '2px',
  padding: '3px 8px',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.7rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.1s ease-out',
  '&:hover': {
    color: '#FF5500',
    borderColor: '#FF5500',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 85, 0, 0.08)'
        : 'rgba(255, 85, 0, 0.05)',
  },
}));

export const StepperContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: '2px 6px',
  borderRadius: '2px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? '#181D26'
      : 'rgba(0, 0, 0, 0.015)',
}));

export const SetBubbleNode = styled('button', {
  shouldForwardProp: (prop) => prop !== 'done',
})<{ done?: boolean }>(({ theme, done }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '2px',
  border: done
    ? '1px solid #059669'
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: done ? 'rgba(5, 150, 105, 0.18)' : 'transparent',
  color: done ? '#059669' : theme.palette.text.secondary,
  fontSize: '0.65rem',
  fontWeight: 700,
  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
  fontVariantNumeric: 'tabular-nums',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.1s ease-out',
  '&:hover': {
    borderColor: '#059669',
  },
}));

export const HoloStamp = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '12px',
  top: '8px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '2px',
  padding: '1px 5px',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.mode === 'dark' ? '#181D26' : 'rgba(0, 0, 0, 0.02)',
}));

export const IndexBadge = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
  fontSize: '0.72rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums',
}));

export const EmptyStateCard = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  textAlign: 'center',
  borderRadius: '4px',
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
}));

export const SpecListItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
  transition: 'border-color 0.1s ease-out',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.22)' : '#CBD5E1',
  },
}));

export const StatCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'accentColor',
})<{ accentColor: string }>(({ theme, accentColor }) => ({
  padding: theme.spacing(2),
  borderRadius: '4px',
  position: 'relative',
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderTop: `2px solid ${accentColor}`,
  boxShadow: 'none',
}));

export const WorkoutListUl = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// --- Nutrition & Yuka Design System Components ---

export const CalorieHudCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.25),
  borderRadius: '4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const CalorieMathGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(1.25),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

export const CaloriePod = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'highlight',
})<{ highlight?: boolean }>(({ theme, highlight }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.25, 1),
  borderRadius: '2px',
  backgroundColor: highlight
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 85, 0, 0.12)'
      : 'rgba(255, 85, 0, 0.08)'
    : theme.palette.mode === 'dark'
      ? '#181D26'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${highlight ? '#FF5500' : theme.palette.divider}`,
  textAlign: 'center',
}));

export const MacroProgressWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const MacroTrack = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '6px',
  borderRadius: '2px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  position: 'relative',
}));

export const MacroBarFill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fillColor' && prop !== 'percentage',
})<{ fillColor: string; percentage: number }>(({ fillColor, percentage }) => ({
  height: '100%',
  width: `${Math.min(100, Math.max(0, percentage))}%`,
  backgroundColor: fillColor,
  borderRadius: '2px',
  transition: 'width 0.15s ease-out',
}));

export const YukaBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'rating',
})<{ rating: 'Excellent' | 'Good' | 'Mediocre' | 'Bad' }>(({ rating }) => {
  const colorMap = {
    Excellent: '#059669',
    Good: '#00D8F6',
    Mediocre: '#EAB308',
    Bad: '#EF4444',
  };
  const color = colorMap[rating] || '#059669';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 8px',
    borderRadius: '2px',
    backgroundColor: `${color}18`,
    border: `1px solid ${color}45`,
    color: color,
    fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  };
});

export const MealSectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const MealRowItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 1.25),
  borderRadius: '2px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? '#181D26'
      : 'rgba(0, 0, 0, 0.015)',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  transition: 'border-color 0.1s ease-out',
  '&:hover': {
    borderColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.22)' : '#CBD5E1',
  },
}));

export const FoodInspectorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.25),
  borderRadius: '4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const AdditiveRiskBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'risk',
})<{ risk: 'None' | 'Low' | 'Moderate' | 'Hazardous' }>(({ risk }) => {
  const riskColors = {
    None: '#059669',
    Low: '#00D8F6',
    Moderate: '#EAB308',
    Hazardous: '#EF4444',
  };
  const color = riskColors[risk] || '#059669';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '2px',
    border: `1px solid ${color}50`,
    backgroundColor: `${color}14`,
    color: color,
    fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  };
});

export const CleanSwapCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '4px',
  border: '1px solid rgba(5, 150, 105, 0.35)',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(5, 150, 105, 0.08)'
      : 'rgba(5, 150, 105, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const ScannerViewfinderBox = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '260px',
  borderRadius: '4px',
  backgroundColor: '#090B0E',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(0, 216, 246, 0.4)',
  boxShadow: 'none',
  animation: 'pulseGlow 2.5s infinite ease-in-out',
}));

export const ScannerLaserBeam = styled(Box)({
  position: 'absolute',
  left: '5%',
  width: '90%',
  height: '1px',
  backgroundColor: '#00D8F6',
  boxShadow: '0 0 6px #00D8F6',
  zIndex: 10,
  animation: 'laserScan 2.4s infinite ease-in-out',
});

export const ScannerReticleBox = styled(Box)({
  position: 'absolute',
  width: '210px',
  height: '140px',
  border: '1px dashed rgba(255, 255, 255, 0.35)',
  borderRadius: '2px',
  pointerEvents: 'none',
  zIndex: 5,
});

export const UserAvatarButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 10px',
  borderRadius: '4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#181D26' : 'rgba(0, 0, 0, 0.02)',
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.78rem',
  fontWeight: 600,
  '&:hover': {
    borderColor: '#FF5500',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 85, 0, 0.12)' : 'rgba(255, 85, 0, 0.06)',
  },
}));

export const AuthContainerBox = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

export const ConsoleLayoutGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  alignItems: 'flex-start',
  width: '100%',
  marginTop: theme.spacing(2),
}));

export const ConsoleLeftRail = styled(Box)(({ theme }) => ({
  width: '240px',
  flexShrink: 0,
  position: 'sticky',
  top: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

export const ConsoleCenterStage = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const ConsoleRightRail = styled(Box)(({ theme }) => ({
  width: '310px',
  flexShrink: 0,
  position: 'sticky',
  top: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

export const RailCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const RailSectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StationRailBtn = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '8px 12px',
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.03em',
  color: active ? '#FF5500' : theme.palette.text.primary,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 85, 0, 0.12)'
      : 'rgba(255, 85, 0, 0.08)'
    : 'transparent',
  border: `1px solid ${active ? 'rgba(255, 85, 0, 0.35)' : 'transparent'}`,
  transition: 'all 0.1s ease-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.04)',
    color: '#FF5500',
  },
}));

export const ChronometerDigits = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--font-telemetry, 'Geist Mono', monospace)",
  fontSize: '2rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
  color: theme.palette.text.primary,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.1,
  padding: '6px 0',
}));
