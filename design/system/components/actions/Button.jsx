import React from 'react';

export function Button({ variant = 'primary', href, type, disabled = false, busy = false, children, ...rest }) {
  if (href) {
    return (
      <a href={disabled ? undefined : href} data-button={variant} aria-disabled={disabled ? 'true' : undefined} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type || (variant === 'primary' ? 'submit' : 'button')} data-button={variant} disabled={disabled} aria-busy={busy ? 'true' : undefined} {...rest}>
      {children}
    </button>
  );
}
