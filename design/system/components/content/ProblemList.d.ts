export interface ProblemItem { text: string; status?: 'ok' | 'warn' | 'critical' }
/**
 * Queue-style list: numbered rows with hairline dividers, two columns from 768px.
 * @startingPoint section="Content" subtitle="Queue rows for the problem list" viewport="700x320"
 */
export interface ProblemListProps {
  items: Array<string | ProblemItem>;
}
export declare function ProblemList(props: ProblemListProps): JSX.Element;
