// Marks copy the owner has not supplied yet, so placeholder text is never mistaken for real claims.
export function PlaceholderNotice() {
  return (
    <p role="note">
      <strong>Placeholder copy.</strong> Replace this text before launch.
    </p>
  );
}
