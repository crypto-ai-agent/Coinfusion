import { render, screen } from '@testing-library/react';
import { ExternalLink } from '@/components/shared/ExternalLink';
import { Globe } from 'lucide-react';
import { describe, it, expect } from 'vitest';

describe('ExternalLink', () => {
  it('renders link with text correctly', () => {
    render(
      <ExternalLink href="https://example.com">
        Visit Website
      </ExternalLink>
    );
    const link = screen.getByText('Visit Website');
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('renders with custom icon', () => {
    render(
      <ExternalLink href="https://example.com" icon={<Globe className="h-4 w-4" />}>
        Website
      </ExternalLink>
    );
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('applies different variants', () => {
    const { container } = render(
      <ExternalLink href="https://example.com" variant="ghost">
        Ghost Link
      </ExternalLink>
    );
    expect(container.firstChild).toHaveClass('ghost');
  });
});