import React from 'react';

export function DriftScan({ rows = 6, findingRow = 3, finding = 'Drift', summary = '1 finding', title = 'Scan' }) {
  const items = [];
  for (let i = 0; i < rows; i++) {
    const hit = i === findingRow;
    items.push(<li key={i} data-status={hit ? 'warn' : 'ok'} data-flag={hit ? '' : undefined}>{hit ? <span>{finding}</span> : null}</li>);
  }
  return (
    <figure data-illustration="scan" role="img" aria-label="A drift scan across settings. Every check passes except one.">
      <p><span>{title}</span><span data-status="warn">{summary}</span></p>
      <hr />
      <ol>{items}</ol>
    </figure>
  );
}
