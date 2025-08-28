
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SeoDashboardClient from './SeoDashboardClient';
import { toast } from 'sonner';

// Mock the fetch API
global.fetch = jest.fn();

// Mock the toast library
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

describe('SeoDashboardClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display a loading spinner initially', () => {
    render(<SeoDashboardClient />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should fetch and display sitemap status on successful load', async () => {
    const mockStatus = {
      lastGenerated: new Date().toISOString(),
      indexedPages: 1234,
      lastPing: new Date().toISOString(),
      jobStatus: 'idle',
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatus,
    });

    render(<SeoDashboardClient />);

    await waitFor(() => {
      expect(screen.getByText('SEO Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('Last Sitemap Generated')).toBeInTheDocument();
    expect(screen.getByText('Indexed Pages')).toBeInTheDocument();
    expect(screen.getByText('Last Search Engine Ping')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should display an error message if fetching status fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<SeoDashboardClient />);

    await waitFor(() => {
      expect(screen.getByText('Error loading SEO Dashboard')).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith('Could not load sitemap data.');
  });

  it('should call the regenerate API when the button is clicked', async () => {
    const mockStatus = { jobStatus: 'idle' };
     (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatus,
    });

    render(<SeoDashboardClient />);

    await waitFor(() => {
        expect(screen.getByText('Regenerate Sitemap')).toBeInTheDocument();
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    fireEvent.click(screen.getByText('Regenerate Sitemap'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/admin/seo/sitemap/regenerate', { method: 'POST' });
    });

    expect(toast.info).toHaveBeenCalledWith('Sitemap regeneration started...');
    expect(toast.success).toHaveBeenCalledWith('Sitemap regeneration initiated successfully!');
  });
});
