import React from 'react';

export function ProblemList({ items = [] }) {
  return (
    <ul data-list="queue">
      {items.map((it, i) => {
        const text = typeof it === 'string' ? it : it.text;
        const status = typeof it === 'string' ? undefined : it.status;
        return <li key={i} data-status={status}>{text}</li>;
      })}
    </ul>
  );
}
