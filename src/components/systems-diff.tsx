// Home hero diagram (design/system: SystemsDiff). Empty cells render as skeleton
// bars standing in for records; the one flagged row is the finding.
const ROWS_BEFORE_FINDING = 3;
const ROWS_AFTER_FINDING = 2;

function BlankRow() {
  return (
    <tr>
      <td />
      <td />
      <td />
    </tr>
  );
}

export function SystemsDiff() {
  return (
    <figure
      data-illustration="reconcile"
      role="img"
      aria-label="HR, Active Directory and Entra ID compared side by side. One person who left is still active in both directories."
    >
      <table>
        <thead>
          <tr>
            <th>HR</th>
            <th>AD</th>
            <th>Entra ID</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS_BEFORE_FINDING }, (_, i) => (
            <BlankRow key={`before-${i}`} />
          ))}
          <tr data-flag="">
            <td>Left</td>
            <td>Active</td>
            <td>Active</td>
          </tr>
          {Array.from({ length: ROWS_AFTER_FINDING }, (_, i) => (
            <BlankRow key={`after-${i}`} />
          ))}
        </tbody>
      </table>
      <figcaption>
        <span data-status="critical">1 mismatch</span>
      </figcaption>
    </figure>
  );
}
