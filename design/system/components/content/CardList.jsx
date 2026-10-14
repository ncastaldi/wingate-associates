import React from 'react';
import { StatCallout } from './StatCallout.jsx';

export function CardList({ cards = [] }) {
  return (
    <ul data-list="cards">
      {cards.map((c, i) => (
        <li key={i}>
          <h3>{c.href ? <a href={c.href}>{c.title}</a> : c.title}</h3>
          {c.body ? <p>{c.body}</p> : null}
          {c.stat ? <StatCallout {...c.stat} /> : null}
        </li>
      ))}
    </ul>
  );
}
