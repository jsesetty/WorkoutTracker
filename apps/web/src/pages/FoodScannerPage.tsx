import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import VerifiedIcon from '@mui/icons-material/Verified';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import {
  FoodInspectorCard,
  AdditiveRiskBadge,
  CleanSwapCard,
} from '../components/styled';
import { YukaScoreBadge } from '../components/YukaScoreBadge';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { FoodItem, MealCategory, AdditiveInfo } from '../types/nutrition';
import { storage } from '../services/storageFallback';

type FilterTab = 'ALL' | 'EXCELLENT' | 'WARNINGS' | 'ORGANIC';

export const FoodScannerPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');

  // Quick log menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFoodForLog, setSelectedFoodForLog] = useState<FoodItem | null>(null);

  // Barcode scanner modal state
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);

  // New food dialog state
  const [newFoodDialogOpen, setNewFoodDialogOpen] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodBrand, setNewFoodBrand] = useState('');
  const [newFoodCalories, setNewFoodCalories] = useState('150');
  const [newFoodProtein, setNewFoodProtein] = useState('15');
  const [newFoodCarbs, setNewFoodCarbs] = useState('10');
  const [newFoodFat, setNewFoodFat] = useState('3');
  const [newFoodServing, setNewFoodServing] = useState('100g');
  const [newFoodIsOrganic, setNewFoodIsOrganic] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  // Fetch foods
  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/foods');
      if (res.ok) {
        const data: FoodItem[] = await res.json();
        setFoods(data);
        storage.saveFoods(data);
      } else {
        setFoods(storage.getFoods());
      }
    } catch {
      setFoods(storage.getFoods());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // Filtered foods
  const filteredFoods = useMemo(() => {
    let result = foods;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.brand && f.brand.toLowerCase().includes(q)) ||
          (f.barcode && f.barcode.toLowerCase().includes(q))
      );
    }

    if (activeFilter === 'EXCELLENT') {
      result = result.filter((f) => f.yukaScore >= 75);
    } else if (activeFilter === 'WARNINGS') {
      result = result.filter((f) => f.yukaScore < 50);
    } else if (activeFilter === 'ORGANIC') {
      result = result.filter((f) => f.isOrganic);
    }

    return result;
  }, [foods, searchQuery, activeFilter]);

  // Quick log to diary
  const handleOpenLogMenu = (event: React.MouseEvent<HTMLElement>, food: FoodItem) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedFoodForLog(food);
  };

  const handleQuickLogToCategory = async (category: MealCategory) => {
    setMenuAnchorEl(null);
    if (!selectedFoodForLog) return;

    const payload = {
      name: selectedFoodForLog.name,
      category,
      calories: selectedFoodForLog.calories,
      protein: selectedFoodForLog.protein,
      carbs: selectedFoodForLog.carbs,
      fat: selectedFoodForLog.fat,
      servingSize: selectedFoodForLog.servingSize,
      foodId: selectedFoodForLog.id,
      yukaScore: selectedFoodForLog.yukaScore,
      yukaRating: selectedFoodForLog.yukaRating,
    };

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to log');

      setSnackbar({
        open: true,
        message: `Added ${selectedFoodForLog.name} to ${category}!`,
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to add food to diary',
        severity: 'error',
      });
    }
  };

  // Submit new food to library
  const handleCreateFoodSubmit = async () => {
    if (!newFoodName.trim()) {
      setSnackbar({
        open: true,
        message: 'Food name is required',
        severity: 'error',
      });
      return;
    }

    const payload = {
      name: newFoodName.trim(),
      brand: newFoodBrand.trim() || undefined,
      calories: Number(newFoodCalories) || 0,
      protein: Number(newFoodProtein) || 0,
      carbs: Number(newFoodCarbs) || 0,
      fat: Number(newFoodFat) || 0,
      servingSize: newFoodServing.trim() || '100g',
      isOrganic: newFoodIsOrganic,
      novaGroup: newFoodIsOrganic ? 1 : 2,
      additives: [],
    };

    try {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to add food');

      const savedFood: FoodItem = await res.json();
      setFoods((prev) => [savedFood, ...prev]);
      setNewFoodDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Added ${savedFood.name} with Yuka score ${savedFood.yukaScore}/100!`,
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Could not create food item',
        severity: 'error',
      });
    }
  };

  const handleFoodDetectedFromScanner = (scannedFood: FoodItem) => {
    setFoods((prev) => {
      const exists = prev.some((f) => f.id === scannedFood.id);
      if (!exists) {
        const updated = [scannedFood, ...prev];
        storage.saveFoods(updated);
        return updated;
      }
      return prev;
    });
    setSearchQuery(scannedFood.name);
    setSnackbar({
      open: true,
      message: `Scanned: ${scannedFood.name} (Yuka: ${scannedFood.yukaScore}/100)`,
      severity: 'success',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              color: 'text.primary',
            }}
          >
            Food Quality & Ingredient Intel
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Yuka 0–100 Health Scoring, Chemical Additives Audit, NOVA Processing Levels, and Clean Swaps
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<QrCodeScannerIcon />}
            onClick={() => setBarcodeScannerOpen(true)}
            data-testid="open-barcode-scanner-btn"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              borderRadius: '4px',
            }}
          >
            SCAN BARCODE
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setNewFoodDialogOpen(true)}
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              borderRadius: '4px',
            }}
          >
            Add Food Item
          </Button>
        </Box>
      </Box>

      {/* Search & Filter Toolbar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField
          fullWidth
          placeholder="Search verified foods, athlete fuels, additives, or brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All Foods"
            clickable
            color={activeFilter === 'ALL' ? 'primary' : 'default'}
            onClick={() => setActiveFilter('ALL')}
            sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          />
          <Chip
            label="Excellent (75–100)"
            clickable
            color={activeFilter === 'EXCELLENT' ? 'primary' : 'default'}
            onClick={() => setActiveFilter('EXCELLENT')}
            sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          />
          <Chip
            label="Warnings / Mediocre (<50)"
            clickable
            color={activeFilter === 'WARNINGS' ? 'primary' : 'default'}
            onClick={() => setActiveFilter('WARNINGS')}
            sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          />
          <Chip
            label="100% Organic"
            clickable
            color={activeFilter === 'ORGANIC' ? 'primary' : 'default'}
            onClick={() => setActiveFilter('ORGANIC')}
            sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredFoods.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Typography variant="body1">No food items matched your search criteria.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredFoods.map((food) => (
            <FoodInspectorCard key={food.id}>
              {/* Top row: Name, Brand, Score, and Quick Log Action */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: 'text.primary',
                      }}
                    >
                      {food.name}
                    </Typography>
                    {food.isOrganic && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: '0.85rem !important' }} />}
                        label="Organic"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{
                          fontSize: '0.68rem',
                          height: '20px',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {food.brand && (
                      <Typography
                        sx={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.78rem',
                          color: 'text.secondary',
                          fontWeight: 600,
                        }}
                      >
                        Brand: {food.brand}
                      </Typography>
                    )}
                    {food.barcode && (
                      <Chip
                        label={`UPC: ${food.barcode}`}
                        size="small"
                        sx={{
                          height: '20px',
                          fontSize: '0.68rem',
                          fontFamily: "'Space Grotesk', monospace",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <YukaScoreBadge score={food.yukaScore} rating={food.yukaRating} />

                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<BookmarkAddIcon />}
                    onClick={(e) => handleOpenLogMenu(e, food)}
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      borderRadius: '2px',
                    }}
                  >
                    Log to Diary
                  </Button>
                </Box>
              </Box>

              {/* Nutrition & NOVA details */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  pt: 0.5,
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-telemetry)',
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {food.calories} kcal <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>({food.servingSize})</Box>
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.78rem',
                    color: 'text.secondary',
                  }}
                >
                  Protein: <Box component="span" sx={{ fontFamily: 'var(--font-telemetry)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{food.protein}g</Box> • Carbs: <Box component="span" sx={{ fontFamily: 'var(--font-telemetry)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{food.carbs}g</Box> • Fat: <Box component="span" sx={{ fontFamily: 'var(--font-telemetry)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{food.fat}g</Box>
                </Typography>

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: food.novaGroup === 4 ? '#EF4444' : 'text.secondary',
                    }}
                  >
                    NOVA {food.novaGroup}: {food.novaGroup === 4 ? 'Ultra-Processed' : food.novaGroup === 1 ? 'Unprocessed' : 'Processed'}
                  </Typography>
                </Box>
              </Box>

              {/* Additives Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.secondary',
                  }}
                >
                  Chemical Additives & E-Numbers ({food.additives.length})
                </Typography>

                {food.additives.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#059669' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: '1rem' }} />
                    <Typography
                      sx={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      Clean Formulation — Zero synthetic additives or chemical colorants detected.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {food.additives.map((add: AdditiveInfo) => (
                      <Box
                        key={add.code}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          p: '4px 8px',
                          borderRadius: '2px',
                          border: (theme) => `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <AdditiveRiskBadge risk={add.risk}>
                          {add.risk}
                        </AdditiveRiskBadge>
                        <Typography
                          sx={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {add.code} ({add.name})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Clean Alternative Recommendation */}
              {food.cleanAlternativeName && (
                <CleanSwapCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon sx={{ color: '#EAB308', fontSize: '1.2rem' }} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#059669',
                        }}
                      >
                        Recommended Clean Swap
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: 'text.primary',
                        }}
                      >
                        {food.cleanAlternativeName}
                      </Typography>
                    </Box>
                  </Box>
                </CleanSwapCard>
              )}
            </FoodInspectorCard>
          ))}
        </Box>
      )}

      {/* Quick Log Category Picker Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => handleQuickLogToCategory('Breakfast')}>
          Log to Breakfast
        </MenuItem>
        <MenuItem onClick={() => handleQuickLogToCategory('Lunch')}>
          Log to Lunch
        </MenuItem>
        <MenuItem onClick={() => handleQuickLogToCategory('Dinner')}>
          Log to Dinner
        </MenuItem>
        <MenuItem onClick={() => handleQuickLogToCategory('Snacks')}>
          Log to Snacks
        </MenuItem>
      </Menu>

      {/* Add Custom Food Dialog */}
      <Dialog
        open={newFoodDialogOpen}
        onClose={() => setNewFoodDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '4px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Add Food to Verified Directory
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="Food Name"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
            placeholder="e.g. Grass-Fed Beef Tenderloin"
          />
          <TextField
            fullWidth
            label="Brand / Producer (Optional)"
            value={newFoodBrand}
            onChange={(e) => setNewFoodBrand(e.target.value)}
            placeholder="e.g. Pasture Harvest Co."
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
            <TextField
              label="Calories (kcal)"
              type="number"
              value={newFoodCalories}
              onChange={(e) => setNewFoodCalories(e.target.value)}
            />
            <TextField
              label="Serving Size"
              value={newFoodServing}
              onChange={(e) => setNewFoodServing(e.target.value)}
            />
            <TextField
              label="Protein (g)"
              type="number"
              value={newFoodProtein}
              onChange={(e) => setNewFoodProtein(e.target.value)}
            />
            <TextField
              label="Carbs (g)"
              type="number"
              value={newFoodCarbs}
              onChange={(e) => setNewFoodCarbs(e.target.value)}
            />
            <TextField
              label="Fat (g)"
              type="number"
              value={newFoodFat}
              onChange={(e) => setNewFoodFat(e.target.value)}
            />
            <Button
              variant={newFoodIsOrganic ? 'contained' : 'outlined'}
              color="success"
              onClick={() => setNewFoodIsOrganic(!newFoodIsOrganic)}
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              {newFoodIsOrganic ? '✓ Certified Organic' : 'Mark as Organic'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setNewFoodDialogOpen(false)} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateFoodSubmit}
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
            }}
          >
            Compute Yuka Score & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        open={barcodeScannerOpen}
        onClose={() => setBarcodeScannerOpen(false)}
        onFoodDetected={handleFoodDetectedFromScanner}
        onShowNotification={(msg, sev) =>
          setSnackbar({ open: true, message: msg, severity: sev || 'info' })
        }
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
