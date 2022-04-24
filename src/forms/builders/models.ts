import { FormGroup } from '../forms.models.ts';

export interface FormProps<T> {
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';
  classNames: string[];
  show?: (value: T, form: FormGroup<T>, field: string) => boolean;
}

export enum FormFieldType {
  TextInput = 'text-input',
}
