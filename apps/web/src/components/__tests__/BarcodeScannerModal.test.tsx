import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BarcodeScannerModal } from '../BarcodeScannerModal';
import { getGymTheme } from '../../theme';
import { FoodItem } from '../../types/nutrition';

const mockChicken: FoodItem = {
  id: 'food-chicken-breast',
  name: 'Organic Free-Range Chicken Breast',
  brand: 'Local Organics',
  barcode: '078742372487',
  calories: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6,
  servingSize: '150g',
  yukaScore: 98,
  yukaRating: 'Excellent',
  additives: [],
  novaGroup: 1,
  isOrganic: true,
};

describe('BarcodeScannerModal Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders modal header, manual input, and preset chips when opened', () => {
    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <BarcodeScannerModal
          open={true}
          onClose={jest.fn()}
          onFoodDetected={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/FOOD INTEL BARCODE SCANNER/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter barcode digits/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /INSPECT/i })).toBeInTheDocument();
    expect(screen.getByText(/Quick Test Barcodes/i)).toBeInTheDocument();
    expect(screen.getByTestId('preset-barcode-078742372487')).toBeInTheDocument();
  });

  test('inspects barcode via preset chip click and renders detected food card', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        found: true,
        source: 'local_cache',
        product: mockChicken,
      }),
    });

    const onFoodDetectedMock = jest.fn();
    const onCloseMock = jest.fn();

    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <BarcodeScannerModal
          open={true}
          onClose={onCloseMock}
          onFoodDetected={onFoodDetectedMock}
        />
      </ThemeProvider>
    );

    const presetChip = screen.getByTestId('preset-barcode-078742372487');
    fireEvent.click(presetChip);

    await waitFor(() => {
      expect(screen.getByTestId('detected-food-card')).toBeInTheDocument();
    });

    expect(screen.getByText(/Organic Free-Range Chicken Breast/i)).toBeInTheDocument();
    expect(screen.getByText(/98\/100/i)).toBeInTheDocument();
    expect(screen.getByText(/31g/i)).toBeInTheDocument(); // Protein
    expect(screen.getByRole('button', { name: /USE THIS FOOD/i })).toBeInTheDocument();

    // Select and commit food
    fireEvent.click(screen.getByRole('button', { name: /USE THIS FOOD/i }));
    expect(onFoodDetectedMock).toHaveBeenCalledWith(mockChicken);
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('submits manual barcode digits and handles not found response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ found: false, error: 'Product not found' }),
    });

    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <BarcodeScannerModal
          open={true}
          onClose={jest.fn()}
          onFoodDetected={jest.fn()}
        />
      </ThemeProvider>
    );

    const input = screen.getByTestId('barcode-manual-input');
    fireEvent.change(input, { target: { value: '999999999999' } });

    const inspectBtn = screen.getByTestId('barcode-inspect-btn');
    fireEvent.click(inspectBtn);

    await waitFor(() => {
      expect(screen.getByText(/No food item found for barcode 999999999999/i)).toBeInTheDocument();
    });
  });

  test('falls back to offline storage when network request throws error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network offline'));

    // Populate offline storage with a matching food
    localStorage.setItem('ironpulse_foods', JSON.stringify([mockChicken]));

    const onFoodDetectedMock = jest.fn();

    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <BarcodeScannerModal
          open={true}
          onClose={jest.fn()}
          onFoodDetected={onFoodDetectedMock}
        />
      </ThemeProvider>
    );

    const input = screen.getByTestId('barcode-manual-input');
    fireEvent.change(input, { target: { value: '078742372487' } });
    fireEvent.click(screen.getByTestId('barcode-inspect-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('detected-food-card')).toBeInTheDocument();
    });

    expect(screen.getByText(/Local Cached Database/i)).toBeInTheDocument();
  });
});
