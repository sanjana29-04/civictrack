import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';

describe('Common Component Badges', () => {
  it('renders StatusBadge with correct text for different statuses', () => {
    const { rerender } = render(<StatusBadge status="SUBMITTED" />);
    expect(screen.getByText('Submitted')).toBeInTheDocument();

    rerender(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    rerender(<StatusBadge status="RESOLVED_AWAITING_VERIFICATION" />);
    expect(screen.getByText('Awaiting Verification')).toBeInTheDocument();

    rerender(<StatusBadge status="CLOSED" />);
    expect(screen.getByText('Closed & Verified')).toBeInTheDocument();

    rerender(<StatusBadge status="REOPENED" />);
    expect(screen.getByText('Reopened')).toBeInTheDocument();
  });

  it('renders PriorityBadge correctly', () => {
    const { rerender } = render(<PriorityBadge priority="CRITICAL" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();

    rerender(<PriorityBadge priority="HIGH" />);
    expect(screen.getByText('High')).toBeInTheDocument();

    rerender(<PriorityBadge priority="LOW" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders CategoryBadge correctly', () => {
    const { rerender } = render(<CategoryBadge category="ROADS_POTHOLES" />);
    expect(screen.getByText('Roads & Potholes')).toBeInTheDocument();

    rerender(<CategoryBadge category="DRAINAGE_WATERLOGGING" />);
    expect(screen.getByText('Drainage & Waterlogging')).toBeInTheDocument();
  });
});
