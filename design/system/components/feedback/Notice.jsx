import React from 'react';

export function Notice({ status, children }) {
  return <p role="note" data-status={status}>{children}</p>;
}
