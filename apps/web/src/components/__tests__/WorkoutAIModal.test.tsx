import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { WorkoutAIModal } from '../WorkoutAIModal';
import { getGymTheme } from '../../theme';

describe('WorkoutAIModal Component & Two-Pass Parsing UI', () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders modal elements and default transcript when opened', () => {
    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <WorkoutAIModal
          open={true}
          onClose={jest.fn()}
          onCommitExercises={jest.fn()}
          onShowNotification={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/AI NATURAL LANGUAGE WORKOUT PARSER/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PARSE TRANSCRIPT/i })).toBeInTheDocument();
  });

  test('parses transcript and displays verified and needs-confirmation movements', async () => {
    const mockResponse = {
      extractedTitle: 'Session: Concept2 Rowing Ergometer + Wall Balls',
      overallConfidence: 0.88,
      exercises: [
        {
          rawInputString: 'Rowed 2000m in 7:15',
          matchedCatalogId: 'e0000001-0000-4000-8000-000000000013',
          matchedCatalogName: 'Concept2 Rowing Ergometer',
          confidenceScore: 0.95,
          needsUserConfirmation: false,
          sets: [{ setIndex: 1, reps: 1, distanceMeters: 2000, durationSeconds: 435 }],
        },
        {
          rawInputString: '4 sets of 15 wall balls',
          matchedCatalogId: 'e0000001-0000-4000-8000-000000000014',
          matchedCatalogName: 'Wall Balls',
          confidenceScore: 0.78,
          needsUserConfirmation: true,
          suggestedCandidates: [
            {
              catalogId: 'e0000001-0000-4000-8000-000000000014',
              name: 'Wall Balls',
              muscleGroup: 'FULL_BODY',
              confidenceScore: 0.78,
            },
          ],
          sets: [{ setIndex: 1, reps: 15 }],
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const commitMock = jest.fn();
    const notifyMock = jest.fn();
    const closeMock = jest.fn();

    render(
      <ThemeProvider theme={getGymTheme('dark')}>
        <WorkoutAIModal
          open={true}
          onClose={closeMock}
          onCommitExercises={commitMock}
          onShowNotification={notifyMock}
        />
      </ThemeProvider>
    );

    const parseBtn = screen.getByRole('button', { name: /PARSE TRANSCRIPT/i });
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText(/Concept2 Rowing Ergometer/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Wall Balls/i).length).toBeGreaterThanOrEqual(1);
    });

    // Check confidence chips
    expect(screen.getByText(/VERIFIED \(95%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/CONFIRM MOVEMENT \(78%\)/i)).toBeInTheDocument();

    // Commit to session
    const commitBtn = screen.getByRole('button', { name: /LOG ALL TO ACTIVE SESSION/i });
    fireEvent.click(commitBtn);

    expect(commitMock).toHaveBeenCalledTimes(1);
    expect(commitMock.mock.calls[0][0]).toHaveLength(2);
    expect(notifyMock).toHaveBeenCalledWith(
      expect.stringContaining('Logged 2 AI-parsed movements'),
      'success'
    );
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
