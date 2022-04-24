import { App } from "dinovel/render/vue-models.ts";
import { DnTextInput } from 'dinovel/widgets/__.ts';
import { createFormControlComponent } from "./form.control.ts";
import { createDynamicFormComponent } from "./form.dynamic.ts";
import { FormFieldType } from './builders/models.ts';

export const DEFAULT_FORM_CONTROLS: Record<string, unknown> = {
  [FormFieldType.TextInput]: DnTextInput,
};

export function useDynamicForm(app: App, components: Record<string, unknown>) {
  const FormControl = createFormControlComponent(components);
  const DynamicForm = createDynamicFormComponent(FormControl);
  app.component('dynamic-form', DynamicForm);
}
