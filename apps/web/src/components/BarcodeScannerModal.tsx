import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import PublicIcon from '@mui/icons-material/Public';
import StorageIcon from '@mui/icons-material/Storage';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import {
  ScannerViewfinderBox,
  ScannerLaserBeam,
  ScannerReticleBox,
} from './styled';
import { YukaScoreBadge } from './YukaScoreBadge';
import { FoodItem } from '../types/nutrition';
import { storage } from '../services/storageFallback';

export interface BarcodeScannerModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onFoodDetected: (food: FoodItem) => void;
  readonly onShowNotification?: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

interface DetectedBarcode {
  readonly rawValue: string;
  readonly format?: string;
}

interface IBarcodeDetector {
  detect(image: ImageBitmapSource): Promise<readonly DetectedBarcode[]>;
}

interface PresetBarcode {
  readonly label: string;
  readonly code: string;
  readonly expectedName: string;
  readonly category: string;
}

const PRESET_BARCODES: readonly PresetBarcode[] = [
  { label: '🍗 Free-Range Chicken', code: '078742372487', expectedName: 'Chicken Breast', category: 'High Protein' },
  { label: '🥛 Greek Yogurt', code: '073420000112', expectedName: 'Plain Greek Yogurt', category: 'Probiotic' },
  { label: '🐟 Wild Salmon', code: '011110824424', expectedName: 'Wild Sockeye Salmon', category: 'Omega-3' },
  { label: '🥣 Rolled Oats', code: '030000010204', expectedName: 'Whole Grain Oats', category: 'Clean Carbs' },
  { label: '💪 Whey Isolate', code: '748927056464', expectedName: 'Clean Whey Isolate', category: 'Supplements' },
  { label: '🍫 Protein Bar', code: '850009664003', expectedName: 'Ultra Crunch Bar', category: 'Processed' },
  { label: '🥤 Energy Soda', code: '049000028904', expectedName: 'Carbonated Soda', category: 'Additives' },
];

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  open,
  onClose,
  onFoodDetected,
  onShowNotification,
}) => {
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedFood, setDetectedFood] = useState<FoodItem | null>(null);
  const [detectionSource, setDetectionSource] = useState<'local_cache' | 'open_food_facts' | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const isLookingUpRef = useRef<boolean>(false);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Execute barcode lookup against backend / Open Food Facts with local cache fallback
  const lookupBarcode = useCallback(
    async (codeToLookup: string) => {
      const cleanCode = codeToLookup.trim().replace(/[^a-zA-Z0-9]/g, '');
      if (!cleanCode) return;

      setLoading(true);
      setLookupError(null);
      isLookingUpRef.current = true;

      try {
        // First check server endpoint (which queries local cache and Open Food Facts API)
        const res = await fetch(`/api/v1/foods/barcode/${encodeURIComponent(cleanCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.found && data.product) {
            setDetectedFood(data.product);
            setDetectionSource(data.source || 'open_food_facts');
            onShowNotification?.(`Food detected: ${data.product.name}`, 'success');
            return;
          }
        }

        // Fallback to client-side local cache if server lookup was unavailable (e.g. offline)
        const localFoods = storage.getFoods();
        const matched = localFoods.find((f) => f.barcode === cleanCode);
        if (matched) {
          setDetectedFood(matched);
          setDetectionSource('local_cache');
          onShowNotification?.(`Found in offline database: ${matched.name}`, 'info');
          return;
        }

        setLookupError(
          `No food item found for barcode ${cleanCode}. You can log this food as a custom item.`
        );
      } catch (err) {
        // Offline resilience fallback
        const localFoods = storage.getFoods();
        const matched = localFoods.find((f) => f.barcode === cleanCode);
        if (matched) {
          setDetectedFood(matched);
          setDetectionSource('local_cache');
          onShowNotification?.(`Found in offline database: ${matched.name}`, 'info');
        } else {
          setLookupError('Network error connecting to barcode database. Please check your connection.');
        }
      } finally {
        setLoading(false);
        isLookingUpRef.current = false;
      }
    },
    [onShowNotification]
  );

  // Initialize camera and native BarcodeDetector loop when modal opens
  useEffect(() => {
    if (!open) {
      stopCamera();
      setDetectedFood(null);
      setLookupError(null);
      setBarcodeInput('');
      return;
    }

    let isMounted = true;

    async function initCamera() {
      // Guard for environments without mediaDevices (e.g. non-secure origins or test runners)
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (isMounted) {
          setCameraActive(false);
          setCameraError('Camera access requires HTTPS or a supported mobile/desktop browser.');
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {
            // Ignore autoplay restrictions
          });
        }
        setCameraActive(true);
        setCameraError(null);

        // Check if native BarcodeDetector API is supported (Chromium / Chrome Android)
        // Typecast needed because BarcodeDetector is a W3C incubator specification not yet in default DOM lib
        const hasNativeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
        if (hasNativeDetector) {
          const BarcodeDetectorCtor = (
            window as unknown as { BarcodeDetector: new (opts?: { formats: string[] }) => IBarcodeDetector }
          ).BarcodeDetector;

          const detector = new BarcodeDetectorCtor({
            formats: ['ean_13', 'upc_a', 'upc_e', 'ean_8', 'qr_code', 'code_128'],
          });

          // Polling frame detector
          scanIntervalRef.current = window.setInterval(async () => {
            if (isLookingUpRef.current || !videoRef.current || videoRef.current.readyState < 2) {
              return;
            }
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0 && barcodes[0].rawValue) {
                const code = barcodes[0].rawValue;
                setBarcodeInput(code);
                lookupBarcode(code);
              }
            } catch {
              // Frame decoding error, continue loop
            }
          }, 350);
        }
      } catch (err) {
        if (isMounted) {
          setCameraActive(false);
          setCameraError('Camera permission denied or camera device not found.');
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [open, stopCamera, lookupBarcode]);

  const handleSubmitManualBarcode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!barcodeInput.trim()) return;
    lookupBarcode(barcodeInput.trim());
  };

  const handleSelectFood = () => {
    if (!detectedFood) return;
    onFoodDetected(detectedFood);
    onClose();
  };

  const handleResetScan = () => {
    setDetectedFood(null);
    setDetectionSource(null);
    setLookupError(null);
    setBarcodeInput('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '4px',
          backgroundImage: 'none',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#12151B' : theme.palette.background.paper,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0, 0, 0, 0.6)'
              : '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      }}
      data-testid="barcode-scanner-modal"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <QrCodeScannerIcon color="primary" sx={{ fontSize: '1.8rem' }} />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.1rem',
                lineHeight: 1.2,
              }}
            >
              FOOD INTEL BARCODE SCANNER
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Open Food Facts database integration & native camera detection
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close scanner dialog">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        {/* Camera Viewfinder / Laser HUD */}
        {!detectedFood && (
          <ScannerViewfinderBox data-testid="scanner-viewfinder">
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: cameraActive ? 'block' : 'none',
              }}
            />
            {cameraActive && (
              <>
                <ScannerLaserBeam />
                <ScannerReticleBox />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    color: '#10B981',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '4px',
                    zIndex: 10,
                  }}
                >
                  Align barcode within frame
                </Typography>
              </>
            )}

            {!cameraActive && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  textAlign: 'center',
                }}
              >
                <VideocamOffIcon sx={{ color: 'text.secondary', fontSize: '2.5rem' }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Camera Viewfinder Inactive
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cameraError || 'Use test presets or enter a barcode below to inspect nutritional telemetry.'}
                </Typography>
              </Box>
            )}
          </ScannerViewfinderBox>
        )}

        {/* Loading Indicator */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              py: 2,
            }}
          >
            <CircularProgress size={24} color="primary" />
            <Typography variant="body2" sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Querying Open Food Facts database...
            </Typography>
          </Box>
        )}

        {/* Error Alert */}
        {lookupError && !loading && (
          <Alert severity="warning" onClose={() => setLookupError(null)}>
            {lookupError}
          </Alert>
        )}

        {/* Scanned Food Summary Card */}
        {detectedFood && !loading && (
          <Card
            variant="outlined"
            sx={{
              borderRadius: '4px',
              borderColor: 'primary.main',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#181D26' : '#FFFFFF',
            }}
            data-testid="detected-food-card"
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                      {detectedFood.name}
                    </Typography>
                    {detectedFood.isOrganic && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: '0.9rem !important' }} />}
                        label="Organic"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {detectedFood.brand || 'Verified Brand'} • {detectedFood.servingSize}
                  </Typography>
                  {detectedFood.barcode && (
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "'Space Grotesk', monospace", color: 'text.secondary' }}
                    >
                      UPC: {detectedFood.barcode}
                    </Typography>
                  )}
                </Box>
                <YukaScoreBadge score={detectedFood.yukaScore} rating={detectedFood.yukaRating} />
              </Box>

              {/* Macro telemetry pills */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${detectedFood.calories} kcal`}
                  size="small"
                  sx={{ fontFamily: "'Space Grotesk', monospace", fontWeight: 700 }}
                />
                <Chip
                  label={`P: ${detectedFood.protein}g`}
                  size="small"
                  color="primary"
                  sx={{ fontFamily: "'Space Grotesk', monospace", fontWeight: 600 }}
                />
                <Chip
                  label={`C: ${detectedFood.carbs}g`}
                  size="small"
                  sx={{ fontFamily: "'Space Grotesk', monospace" }}
                />
                <Chip
                  label={`F: ${detectedFood.fat}g`}
                  size="small"
                  sx={{ fontFamily: "'Space Grotesk', monospace" }}
                />
                <Chip
                  label={`NOVA ${detectedFood.novaGroup}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: "'Space Grotesk', monospace" }}
                />
              </Box>

              {/* Source attribution badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                {detectionSource === 'open_food_facts' ? (
                  <Chip
                    icon={<PublicIcon sx={{ fontSize: '0.9rem !important' }} />}
                    label="Open Food Facts (ODbL License)"
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                ) : (
                  <Chip
                    icon={<StorageIcon sx={{ fontSize: '0.9rem !important' }} />}
                    label="Local Cached Database"
                    size="small"
                    variant="outlined"
                  />
                )}
                {detectedFood.additives.length > 0 && (
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                    {detectedFood.additives.length} additive(s) identified
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Manual Barcode Input Form */}
        {!detectedFood && (
          <Box component="form" onSubmit={handleSubmitManualBarcode} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter barcode digits (e.g. 078742372487)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              inputProps={{ 'data-testid': 'barcode-manual-input' }}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !barcodeInput.trim()}
              data-testid="barcode-inspect-btn"
              sx={{ px: 3, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              INSPECT
            </Button>
          </Box>
        )}

        {/* Quick Test Barcode Presets */}
        {!detectedFood && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Quick Test Barcodes (Instant Simulation):
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {PRESET_BARCODES.map((preset) => (
                <Chip
                  key={preset.code}
                  label={preset.label}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setBarcodeInput(preset.code);
                    lookupBarcode(preset.code);
                  }}
                  data-testid={`preset-barcode-${preset.code}`}
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        {detectedFood ? (
          <>
            <Button onClick={handleResetScan} color="inherit" sx={{ fontWeight: 600 }}>
              SCAN ANOTHER
            </Button>
            <Button
              onClick={handleSelectFood}
              variant="contained"
              color="primary"
              startIcon={<CheckCircleOutlineIcon />}
              data-testid="barcode-use-food-btn"
              sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              USE THIS FOOD
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
            CLOSE
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
