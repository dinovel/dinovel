import { ButtonEventProps } from "dinovel/widgets/button-event.component.ts";
import { Subject } from 'dinovel/std/reactive/subject.ts';

export interface DnDialogProps {
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

export interface ResultDialogProps<T> extends DnDialogProps {
  result: Subject<DialogResult<T>>;
  type: DialogType;
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
  props: ResultDialogProps<T>;
}

export interface CloseDialogEvent<T> {
  id: string;
  data: DialogResult<T>
  props: ResultDialogProps<T>
}

export interface DialogTypeMap {
  form: unknown;
  alert: boolean;
  confirm: boolean;
  prompt: string;
}

export type DialogType = keyof DialogTypeMap;
