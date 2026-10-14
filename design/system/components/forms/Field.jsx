import React from 'react';

export function Field({ label, name, type = 'text', multiline = false, error, autoComplete, disabled, defaultValue }) {
  const errorId = name + '-error';
  const shared = {
    id: name,
    name,
    disabled,
    defaultValue,
    required: true,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? errorId : undefined,
  };
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {multiline ? <textarea rows={6} {...shared} /> : <input type={type} autoComplete={autoComplete} {...shared} />}
      {error ? <p id={errorId}>{error}</p> : null}
    </div>
  );
}
