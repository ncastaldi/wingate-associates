import React from 'react';

export function SystemsDiff({ systems = ['HR', 'AD', 'Entra ID'], rows = 6, flagRow = 3, flagLabels = ['Left', 'Active', 'Active'], caption = '1 mismatch' }) {
  const body = [];
  for (let r = 0; r < rows; r++) {
    const flagged = r === flagRow;
    body.push(
      <tr key={r} data-flag={flagged ? '' : undefined}>
        {systems.map((s, c) => <td key={c}>{flagged ? flagLabels[c] : null}</td>)}
      </tr>
    );
  }
  return (
    <figure data-illustration="reconcile" role="img" aria-label="HR, Active Directory and Entra ID compared side by side. One person who left is still active in both directories.">
      <table>
        <thead><tr>{systems.map((s) => <th key={s}>{s}</th>)}</tr></thead>
        <tbody>{body}</tbody>
      </table>
      <figcaption><span data-status="critical">{caption}</span></figcaption>
    </figure>
  );
}
