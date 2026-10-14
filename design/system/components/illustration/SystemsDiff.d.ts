/**
 * Illustration: systems side by side with one mismatched row flagged critical. The home hero diagram.
 * @startingPoint section="Illustration" subtitle="Systems compared, one mismatch" viewport="700x330"
 */
export interface SystemsDiffProps {
  systems?: string[];
  rows?: number;
  /** Zero-based index of the flagged row. */
  flagRow?: number;
  flagLabels?: string[];
  caption?: string;
}
export declare function SystemsDiff(props: SystemsDiffProps): JSX.Element;
