/** Label, input or textarea, and an error message linked with aria-describedby. */
export interface FieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email';
  multiline?: boolean;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  defaultValue?: string;
}
export declare function Field(props: FieldProps): JSX.Element;
