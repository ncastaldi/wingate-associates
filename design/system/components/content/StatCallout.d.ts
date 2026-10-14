/** Before and after number with the sentence that explains it. The caption is what screen readers hear. */
export interface StatCalloutProps {
  from: string;
  to: string;
  /** The full sentence from the copy, verbatim. */
  caption: string;
}
export declare function StatCallout(props: StatCalloutProps): JSX.Element;
