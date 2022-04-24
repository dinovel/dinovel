// deno-lint-ignore-file no-explicit-any
import { IValueMap, IFullValueMap } from "dinovel/std/value-map/models.ts";
import { FormValidator, FormValue } from "../forms.models.ts";
import { Dinovel } from "dinovel/engine/dinovel.ts";

export function buildValue<T>(
  initialValue?: T,
  validators: FormValidator[] = [],
  map: string | IValueMap<T> = 'default'
): FormValue<T> {
  let valueMap: IFullValueMap<T> = Dinovel.valuesMap.map('string') as any;
  if (typeof map === 'string' && map !== 'default') {
    valueMap = Dinovel.valuesMap.map(map as any);
  } else if (typeof map === 'object') {
    valueMap = map as any;
  } else if (map === 'default' && typeof initialValue !== 'undefined') {
    try {
      const typeName = typeof initialValue;
      valueMap = Dinovel.valuesMap.map(typeName as any);
    } catch {/* ignore */}
  }

  let value = undefined;
  if (typeof initialValue !== 'undefined') {
    value = valueMap.serialize(initialValue);
  }

  return {
    touched: false,
    value,
    validators,
    valueMap,
  };
}
