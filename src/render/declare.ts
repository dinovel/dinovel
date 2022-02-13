// deno-lint-ignore-file no-explicit-any ban-types
import { defineComponent } from 'vue';
import type {
  ComponentOptionsMixin,
  ComponentOptionsWithArrayProps,
  ComponentOptionsWithObjectProps,
  ComponentOptionsWithoutProps,
  ComponentPropsOptions,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  MethodOptions,
  RenderFunction,
  SetupContext,
} from './vue-models.ts';

export interface ComponentDetails {
  tagName: string;
  description?: string;
  usageTemplate?: string;
}

export type DeclareComponentResult = DefineComponent<any, any, any, any, any, any, any, any, any> & { __dinovel_props__?: ComponentDetails };

export interface ComponentDeclaration extends ComponentDetails { component: DeclareComponentResult; }

export function declareComponent<Props, RawBindings = object>(
  setup: (props: Readonly<Props>, ctx: SetupContext) => RawBindings | RenderFunction,
): DefineComponent<Props, RawBindings>;
export function declareComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
>(
  options: ComponentOptionsWithoutProps<Props, RawBindings, D, C, M, Mixin, Extends, E, EE>,
): DefineComponent<Props, RawBindings, D, C, M, Mixin, Extends, E, EE>;
export function declareComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string,
>(
  options: ComponentOptionsWithArrayProps<PropNames, RawBindings, D, C, M, Mixin, Extends, E, EE>,
): DefineComponent<
  Readonly<
    {
      [key in PropNames]?: any;
    }
  >,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE
>;
export function declareComponent<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string,
>(
  options: ComponentOptionsWithObjectProps<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>,
): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>;
export function declareComponent(options: any): any {
  return defineComponent(options);
}
