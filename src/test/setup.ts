import { vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});