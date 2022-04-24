import { declareComponent, DeclareComponentResult } from 'dinovel/render/__.ts';
import { ComputedRefImpl } from 'dinovel/render/vue-models.ts';
import { FormProps } from './builders/models.ts';
import { FormGroup, FormField } from './forms.models.ts';
import { computed } from 'vue';

export interface FormControl {
  name: string;
  type: string;
  component: unknown;
}

export const FORM_CONTROL_NAME = 'FormControl';

export function createFormControlComponent(comps: Record<string, unknown>): DeclareComponentResult {

  const controls: FormControl[] = [];
  let index = 0;
  for (const [type, component] of Object.entries(comps)) {
    index++;
    controls.push({
      name: `${FORM_CONTROL_NAME}${index}`,
      type,
      component,
    });
  }

  const components = controls.reduce((acc, { name, component }) => {
    acc[name] = component as DeclareComponentResult;
    return acc;
  }, {} as Record<string, DeclareComponentResult>);

  let template = /*html*/`
<div class="form-control__container" :class="classList" >
  <template v-if="showControl">
`;

  for (const { name, type } of controls) {
    template += /*html*/`
    <template v-if="type === '${type}'">
      <${name}
        class="form-control"
        data-type="${type}"
        v-bind="p"
        v-model="value"
        :errors="errors"
        :touched="touched"
        :name="name"
      />
    </template>
`;
  }

  template += /*html*/`
  </template>
</div>`;

  return declareComponent({
    components,
    template,
    props: {
      group: {
        required: true,
        type: Object as () => FormGroup<unknown>,
      },
      modelValue: {
        required: true,
        type: Object as () => ComputedRefImpl<FormField<unknown>>,
      },
      name: String,
    },
    setup(props, ctx) {
      const group = props.group;
      const field = props.modelValue?.value as FormField<unknown>;

      if (!group || !field) { throw new Error('FormControl: group or field is undefined'); }

      const type = field.type;
      const formProps = field.props as FormProps<unknown>;
      const classNames = formProps.classNames ?? [];
      const size = formProps.size ?? 'auto';
      const show = formProps.show;

      const showControl = computed(() => {
        if (!show) return true;
        return show(field.v.value, group, props.name ?? '');
      });

      const classList = computed(() => [
        ...classNames,
        `form-control--size-${size}`,
        `dn-r-${size}`,
      ]);


      const value = computed({
        get() { return field.v.value; },
        set(v: string | undefined) {
          ctx.emit('update:modelValue',
            {
              ...field,
              v: {
                ...field.v,
                value: v,
              },
            })
        }
      })
      const p = computed(() => ({
        ...field.props,
        size: undefined,
        classNames: undefined,
        show: undefined,
      }));
      const touched = computed(() => field.v.touched);
      const errors = computed(() => field.v.validators
        .map(validator => validator(value.value))
        .filter(error => error !== true)
      );

      return { type, showControl, classList, p, value, touched, errors };
    },
  })
}
