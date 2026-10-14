/** Illustration: a completed scan, all checks ok except one warning. */
export interface DriftScanProps {
  rows?: number;
  findingRow?: number;
  finding?: string;
  summary?: string;
  title?: string;
}
export declare function DriftScan(props: DriftScanProps): JSX.Element;
