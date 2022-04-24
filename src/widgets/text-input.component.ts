import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { computed } from 'vue';

const template = /*html*/`
<div class="dn-text-input">
  <label :for="name" class="dn-text-input__label">{{ label }}</label>
  <input
    :id="name"
    class="dn-text-input__input"
    :class="{ 'dn-text-input__input--error': hasErrors }"
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
  <div class="dn-text-input__errors" v-if="hasErrors">
    <div v-for="error in errors" class="dn-text-input__error">{{ error }}</div>
  </div>
</div>
`;

export const DnTextInput = declareComponent({
  template,
  props: {
    label: String,
    multiline: Boolean,
    size: String,
    show: Function,
    modelValue: String,
    errors: {
      type: Array as () => string[],
      default: () => [],
    },
    touched: Boolean,
    name: String,
  },
  setup(props) {
    const hasErrors = computed(() => props.errors.length > 0 && props.touched);

    return { hasErrors };
  }
});

export default {
  component: DnTextInput,
  tagName: 'dn-text-input',
  description: 'A text input with a label',
  usageTemplate: /*html*/`
<dn-text-input label="This is a label" v-model="value" />
`
} as ComponentDeclaration;
