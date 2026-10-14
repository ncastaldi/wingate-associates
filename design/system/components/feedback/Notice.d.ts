/** Inline notice or banner with a leading dot. Neutral by default. */
export interface NoticeProps {
  status?: 'ok' | 'warn' | 'critical';
  children: React.ReactNode;
}
export declare function Notice(props: NoticeProps): JSX.Element;
