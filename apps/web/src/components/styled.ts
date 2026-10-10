import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, Container, Button } from '@mui/material';

export const AppShell = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
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
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 1px 2px rgba(0, 0, 0, 0.3)'
      : '0 1px 2px rgba(0, 0, 0, 0.04)',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
}));

export const BrandGroup = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const BrandLogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export const BrandTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

export const NavLinksGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  flexWrap: 'wrap',
}));

export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: '0.8rem',
  fontWeight: 600,
  fontFamily: "'Space Grotesk', sans-serif",
  letterSpacing: '0.02em',
  padding: '6px 14px',
  borderRadius: '6px',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.12)'
      : 'rgba(16, 185, 129, 0.08)'
    : 'transparent',
  border: `1px solid ${active ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.04)',
    color: theme.palette.text.primary,
  },
}));

export const MeterCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isMax',
})<{ isMax?: boolean }>(({ theme, isMax }) => ({
  padding: theme.spacing(2.25),
  borderRadius: '12px',
  border: isMax
    ? `1px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const HudMetricPod = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 1.25),
  borderRadius: '8px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${theme.palette.divider}`,
}));

export const InputCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
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
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: `4px solid ${borderColor}`,
  opacity: completed ? 0.75 : 1,
  backgroundColor: completed
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)'
    : theme.palette.background.paper,
  transition: 'border-color 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#CBD5E1',
    borderLeftColor: borderColor,
  },
}));

export const ExerciseTitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  fontSize: '1.05rem',
  fontWeight: 700,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: completed ? theme.palette.text.secondary : theme.palette.text.primary,
  textDecoration: 'none',
  wordBreak: 'break-word',
  cursor: 'pointer',
  lineHeight: 1.35,
}));

export const SetsTableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginTop: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)',
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.25),
}));

export const SetsTableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '50px 1fr 140px 50px',
  alignItems: 'center',
  padding: '4px 8px',
  color: theme.palette.text.secondary,
  fontSize: '0.68rem',
  fontWeight: 700,
  fontFamily: "'Space Grotesk', sans-serif",
  letterSpacing: '0.05em',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '40px 1fr 115px 42px',
  },
}));

export const SetLogRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  display: 'grid',
  gridTemplateColumns: '50px 1fr 140px 50px',
  alignItems: 'center',
  padding: '6px 8px',
  borderRadius: '6px',
  backgroundColor: completed
    ? theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.08)'
      : 'rgba(16, 185, 129, 0.05)'
    : 'transparent',
  border: `1px solid ${completed ? 'rgba(16, 185, 129, 0.25)' : 'transparent'}`,
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '40px 1fr 115px 42px',
  },
}));

export const SetIndexTag = styled(Typography)(({ theme }) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
}));

export const RepStepperBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 6px',
  borderRadius: '6px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
}));

export const RepCountNumber = styled(Typography)(({ theme }) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.78rem',
  fontWeight: 700,
  minWidth: '55px',
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

export const WeightControlBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  padding: '2px 4px',
  borderRadius: '6px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  maxWidth: '160px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '125px',
  },
}));

export const WeightTextInput = styled('input')(({ theme }) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.78rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  textAlign: 'center',
  width: '65px',
  padding: '2px 0',
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.6,
  },
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    fontSize: '0.72rem',
  },
}));

export const SetLogCheckBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  width: '30px',
  height: '30px',
  borderRadius: '6px',
  border: completed
    ? '1px solid #10B981'
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: completed ? '#10B981' : 'transparent',
  color: completed ? '#FFFFFF' : theme.palette.text.secondary,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: '#10B981',
    backgroundColor: completed ? '#059669' : 'rgba(16, 185, 129, 0.12)',
    color: completed ? '#FFFFFF' : '#10B981',
  },
}));

export const AddSetActionBtn = styled(Button)(({ theme }) => ({
  fontSize: '0.72rem',
  fontWeight: 700,
  fontFamily: "'Space Grotesk', sans-serif",
  letterSpacing: '0.04em',
  padding: '5px 12px',
  borderRadius: '6px',
  border: `1px dashed ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  alignSelf: 'flex-start',
  marginTop: '4px',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(16, 185, 129, 0.08)'
        : 'rgba(16, 185, 129, 0.05)',
  },
}));

export const MusclePillButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  border: active
    ? `1px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.12)'
      : 'rgba(16, 185, 129, 0.08)'
    : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  borderRadius: '6px',
  padding: '4px 10px',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
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
    ? `${accentColor}14`
    : 'transparent',
  color: active ? accentColor : theme.palette.text.secondary,
  borderRadius: '6px',
  padding: '5px 10px',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    color: accentColor,
    borderColor: accentColor,
  },
}));

export const SetStepperBtn = styled('button')(({ theme }) => ({
  width: '26px',
  height: '26px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: '0.85rem',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

export const PresetExerciseChip = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  color: theme.palette.text.secondary,
  borderRadius: '16px',
  padding: '3px 9px',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.7rem',
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(16, 185, 129, 0.08)'
        : 'rgba(16, 185, 129, 0.05)',
  },
}));

export const StepperContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: '3px 8px',
  borderRadius: '6px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)',
}));

export const SetBubbleNode = styled('button', {
  shouldForwardProp: (prop) => prop !== 'done',
})<{ done?: boolean }>(({ theme, done }) => ({
  width: '22px',
  height: '22px',
  borderRadius: '4px',
  border: done
    ? `1px solid #10B981`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: done ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
  color: done ? '#10B981' : theme.palette.text.secondary,
  fontSize: '0.65rem',
  fontWeight: 700,
  fontFamily: "'Space Grotesk', sans-serif",
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: '#10B981',
  },
}));

export const HoloStamp = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '14px',
  top: '10px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  padding: '1px 6px',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.65rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
}));

export const IndexBadge = styled(Typography)(({ theme }) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const EmptyStateCard = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  textAlign: 'center',
  borderRadius: '12px',
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: 'transparent',
}));

export const SpecListItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border-color 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#CBD5E1',
  },
}));

export const StatCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'accentColor',
})<{ accentColor: string }>(({ theme, accentColor }) => ({
  padding: theme.spacing(2),
  borderRadius: '10px',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  borderTop: `3px solid ${accentColor}`,
}));

export const WorkoutListUl = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

// --- Nutrition & Yuka Design System Components ---

export const CalorieHudCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const CalorieMathGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(1.5),
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
  padding: theme.spacing(1.5, 1),
  borderRadius: '8px',
  backgroundColor: highlight
    ? theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(16, 185, 129, 0.08)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${highlight ? 'rgba(16, 185, 129, 0.35)' : theme.palette.divider}`,
  textAlign: 'center',
}));

export const MacroProgressWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const MacroTrack = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '8px',
  borderRadius: '4px',
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
  borderRadius: '4px',
  transition: 'width 0.3s ease',
}));

export const YukaBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'rating',
})<{ rating: 'Excellent' | 'Good' | 'Mediocre' | 'Bad' }>(({ theme, rating }) => {
  const colorMap = {
    Excellent: '#10B981',
    Good: '#06B6D4',
    Mediocre: '#F59E0B',
    Bad: '#EF4444',
  };
  const color = colorMap[rating] || '#10B981';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 9px',
    borderRadius: '16px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? `${color}18`
        : `${color}14`,
    border: `1px solid ${color}45`,
    color: color,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
  };
});

export const MealSectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const MealRowItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 1.25),
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  '&:hover': {
    borderColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : '#CBD5E1',
  },
}));

export const FoodInspectorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.25),
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const AdditiveRiskBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'risk',
})<{ risk: 'None' | 'Low' | 'Moderate' | 'Hazardous' }>(({ risk }) => {
  const riskColors = {
    None: '#10B981',
    Low: '#06B6D4',
    Moderate: '#F59E0B',
    Hazardous: '#EF4444',
  };
  const color = riskColors[risk] || '#10B981';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    border: `1px solid ${color}50`,
    backgroundColor: `${color}12`,
    color: color,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.68rem',
    fontWeight: 600,
  };
});

export const CleanSwapCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.08)'
      : 'rgba(16, 185, 129, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const ScannerViewfinderBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '260px',
  borderRadius: '12px',
  backgroundColor: '#0A0F1D',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.5)'}`,
  animation: 'pulseGlow 2.5s infinite ease-in-out',
}));

export const ScannerLaserBeam = styled(Box)({
  position: 'absolute',
  left: '5%',
  width: '90%',
  height: '2px',
  backgroundColor: '#10B981',
  boxShadow: '0 0 12px #10B981, 0 0 20px #10B981',
  zIndex: 10,
  animation: 'laserScan 2.4s infinite ease-in-out',
});

export const ScannerReticleBox = styled(Box)({
  position: 'absolute',
  width: '210px',
  height: '140px',
  border: '2px dashed rgba(255, 255, 255, 0.4)',
  borderRadius: '8px',
  pointerEvents: 'none',
  zIndex: 5,
});

