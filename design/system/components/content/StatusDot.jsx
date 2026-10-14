import React from 'react';

export function StatusDot({ status = 'ok', children }) {
  return <span data-status={status}>{children}</span>;
}
