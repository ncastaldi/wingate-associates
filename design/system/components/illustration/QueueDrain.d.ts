/** Illustration: a long aging ticket queue beside a short healthy one. */
export interface QueueDrainProps {
  before?: Array<'ok' | 'warn' | 'critical' | 'idle'>;
  after?: Array<'ok' | 'warn' | 'critical' | 'idle'>;
  labels?: [string, string];
}
export declare function QueueDrain(props: QueueDrainProps): JSX.Element;
