import React from 'react';

export function EngagementTiles({ tiles = [] }) {
  return (
    <ul data-list="tiles">
      {tiles.map((t, i) => (
        <li key={i}>
          <h3>{t.title}</h3>
          <p>{t.body}</p>
        </li>
      ))}
    </ul>
  );
}
