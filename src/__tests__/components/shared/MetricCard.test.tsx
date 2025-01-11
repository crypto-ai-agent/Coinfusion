import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/components/shared/MetricCard';
import { describe, it, expect } from 'vitest';

describe('MetricCard', () => {
  it('renders label and value correctly', () => {
    render(<MetricCard label="Market Cap" value="$1B" />);
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
    expect(screen.getByText('$1B')).toBeInTheDocument();
  });

  it('renders subValue when provided', () => {
    render(
      <MetricCard 
        label="Supply" 
        value="19M BTC" 
        subValue="90% of max supply" 
      />
    );
    expect(screen.getByText('90% of max supply')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard 
        label="Price" 
        value="$50,000" 
        className="custom-class" 
      />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});