import { FormValue, FormGroup, FormValueTyped } from './forms.models.ts';
import { Dinovel } from "dinovel/engine/dinovel.ts";

function isTypedValue(v: FormValue<unknown>): v is FormValueTyped<unknown> {
  return typeof (v as FormValueTyped<unknown>).valueMap === 'object';
}

export function buildFormValue<T>(g: FormGroup<T>): T {
  // deno-lint-ignore no-explicit-any
  const result: any = {};
  for (const key of Object.keys(g)) {
    const field = g[key as keyof FormGroup<T>];
    const v = field.v;

    if (!v.value) continue;

    // deno-lint-ignore no-explicit-any
    const mapper = isTypedValue(v) ? v.valueMap : Dinovel.valuesMap.map(v.valueType as any);
    result[key] = mapper.parse(v.value);
  }

  return result;
}

export function validateFormGroup<T>(g: FormGroup<T>): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const key of Object.keys(g)) {
    const field = g[key as keyof FormGroup<T>];
    const fieldValue = field.v

    const validators = fieldValue.validators;
    if (!validators || validators.length === 0) continue;

    const errorsForField = validators
      .map(v => v(fieldValue.value))
      .filter(v => v !== true) as string[];
    if (errorsForField.length > 0) {
      errors[key] = errorsForField;
    }
  }

  return errors;
}
