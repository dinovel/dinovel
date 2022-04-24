import { declareComponent, DeclareComponentResult } from 'dinovel/render/__.ts';
import { FormField, FormGroup } from "./forms.models.ts";
import { buildFormValue,validateFormGroup } from './form.utils.ts';
import { computed } from "vue";

export function createDynamicFormComponent(FormControl: DeclareComponentResult): DeclareComponentResult {

  const template = /*html*/`
<div class="form-group dn-row">
  <form-control
    v-for="(map, index) in fields"
    :key="index"
    :group="modelValue"
    :name="map.name"
    v-model="map.field"
  />
</div>`;

  return declareComponent({
    components: {
      FormControl,
    },
    template,
    props: {
      modelValue: {
        required: true,
        type: Object as () => FormGroup<unknown>,
      },
    },
    setup(props, ctx) {
      const p = props.modelValue;
      if (!p) { throw new Error('modelValue is required'); }

      function emitNewValue(key: string, v?: FormField<unknown>) {
        if (!v) { return; }
        const newValue = {
          ...p,
          [key]: v,
        };
        ctx.emit('update:modelValue', newValue);
        ctx.emit('entity', buildFormValue(newValue));
        ctx.emit('errors', validateFormGroup(newValue));
      }

      const fields = computed(() => {
        const result: { name: string, field: unknown }[] = [];
        for (const key of Object.keys(p)) {
          result.push({
            name: key,
            field: computed({
              get() { return p[key as keyof FormGroup<unknown>]; },
              set(v: FormField<unknown> | undefined) { emitNewValue(key, v); }
            })
          });
        }
        return result;
      })

      return { fields, emitNewValue };
    }
  });
}
