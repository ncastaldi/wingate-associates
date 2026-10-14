import React from 'react';

const BEFORE = ['warn', 'warn', 'idle', 'critical', 'warn', 'idle', 'warn'];
const AFTER = ['ok', 'ok', 'idle'];

export function QueueDrain({ before = BEFORE, after = AFTER, labels = ['Before', 'After'] }) {
  const col = (list, label) => (
    <div>
      <ol>{list.map((s, i) => <li key={i} data-status={s} data-flag={s === 'critical' ? 'critical' : undefined} />)}</ol>
      <p>{label}</p>
    </div>
  );
  return (
    <figure data-illustration="queue" role="img" aria-label="A ticket queue before and after. Before, a long queue of aging tickets. After, a short queue with nothing overdue.">
      <div>{col(before, labels[0])}{col(after, labels[1])}</div>
    </figure>
  );
}
