import React from 'react';

export function StatCallout({ from, to, caption }) {
  return (
    <figure data-stat="">
      <p aria-hidden="true">
        <data value={from}>{from}</data>
        <data value={to}>{to}</data>
      </p>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
