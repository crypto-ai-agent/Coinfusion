import { render, screen } from '@testing-library/react';
import { InfoSection } from '@/components/shared/InfoSection';
import { describe, it, expect } from 'vitest';

describe('InfoSection', () => {
  it('renders title and content correctly', () => {
    render(
      <InfoSection title="Overview">
        <p>Test content</p>
      </InfoSection>
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InfoSection title="Test" className="custom-class">
        <p>Content</p>
      </InfoSection>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});