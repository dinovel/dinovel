import { ButtonEventProps } from "dinovel/widgets/button-event.component.ts";
import { Subject } from 'dinovel/std/reactive/subject.ts';

export interface DnDialogComponentProps {
  id: string;
  title?: string;
  icon?: string;
  width?: string;
  height?: string;
  closable?: boolean;
  modal?: boolean;
  fixed?: boolean;
  actions?: ButtonEventProps[];
}

export interface DnDialogProps<T> {
  comp: DnDialogComponentProps;
  type: DialogType;
  result: Subject<DialogResult<T>>;
  initialValue?: T;
}


export interface DialogResultValue<T> {
  id: string;
  value: T;
  hasValue: true;
}

export interface DialogResultCancel {
  id: string;
  hasValue: false;
  error?: string;
}

export type DialogResult<T> = DialogResultValue<T> | DialogResultCancel;

export interface OpenDialogEvent<T> {
  id: string;
  props: DnDialogProps<T>;
}

export interface CloseDialogEvent<T> {
  id: string;
  data: DialogResult<T>
  props: DnDialogProps<T>
}

export interface DialogTypeMap {
  form: unknown;
  alert: boolean;
  confirm: boolean;
  prompt: string;
}

export type DialogType = keyof DialogTypeMap;
