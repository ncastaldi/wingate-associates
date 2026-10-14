/**
 * Primary or secondary action with the small arrow. Renders <a data-button> when href is set, otherwise <button>.
 * @startingPoint section="Actions" subtitle="Primary and secondary buttons with arrow" viewport="700x260"
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  href?: string;
  type?: 'submit' | 'button';
  disabled?: boolean;
  /** Sets aria-busy; pair with disabled and the "Sending…" label. */
  busy?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
