/** Coloured dot followed by a word. The word carries the meaning; the dot never stands alone. */
export interface StatusDotProps {
  status?: 'ok' | 'warn' | 'critical' | 'idle';
  children: React.ReactNode;
}
export declare function StatusDot(props: StatusDotProps): JSX.Element;
