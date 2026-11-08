import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '@/App';

function timeInputs() {
  return Array.from(document.querySelectorAll<HTMLInputElement>('input[type="time"]'));
}

describe('App: room selection', () => {
  it('refreshes the availability result when the selected room changes', () => {
    render(<App />);
    expect(screen.getByText('This time slot is available.')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'd-112' } });
    expect(screen.getByText('Overlaps with existing booking 11:00–12:30.')).toBeInTheDocument();
    expect(screen.queryByText('This time slot is available.')).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'c-310' } });
    expect(
      screen.getByText('This room is currently blocked and cannot be booked.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Overlaps with existing booking 11:00–12:30.')).not.toBeInTheDocument();
  });
});

describe('App: empty filter results', () => {
  it('shows the empty state and disables the time inputs when nothing matches', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '100' } });

    expect(screen.getByText('No rooms match these filters')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    const inputs = timeInputs();
    expect(inputs).toHaveLength(2);
    inputs.forEach((input) => expect(input).toBeDisabled());
  });
});
