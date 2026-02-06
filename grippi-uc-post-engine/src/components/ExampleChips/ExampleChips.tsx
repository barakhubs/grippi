import React from "react";

interface ExampleChip {
  label: string;
  value: string;
}

interface ExampleChipsProps {
  examples: ExampleChip[];
  onSelect: (value: string) => void;
}

export const ExampleChips: React.FC<ExampleChipsProps> = ({
  examples,
  onSelect,
}) => {
  return (
    <div className="ucpe_example-chips">
      <span className="ucpe_example-label">Examples:</span>
      {examples.map((example, idx) => (
        <button
          key={idx}
          type="button"
          className="ucpe_example-chip"
          onClick={() => onSelect(example.value)}
        >
          {example.label}
        </button>
      ))}
    </div>
  );
};
