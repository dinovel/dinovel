import { IValueMap } from "dinovel/std/value-map/models.ts";
import { FormField, FormValidator } from "../forms.models.ts";
import { FormProps, FormFieldType } from './models.ts';
import { buildValue } from './value.builder.ts';

export interface FormTextProps<T> extends FormProps<T> {
  label: string;
  multiline: boolean;
}

export function buildTextInput<T>(
  properties: Partial<FormTextProps<T>> = {},
  initialValue?: T | undefined,
  validators: FormValidator[] = [],
  map: string | IValueMap<T> = 'default'
): FormField<T> {

  const v = buildValue(initialValue, validators, map);

  const props: FormTextProps<T> = {
    size: properties.size ?? 'auto',
    classNames: properties.classNames ?? [],
    show: properties.show,
    label: properties.label ?? '',
    multiline: properties.multiline ?? false,
  };

  return {
    v,
    props,
    type: FormFieldType.TextInput
  };
}
