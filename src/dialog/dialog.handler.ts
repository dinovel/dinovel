import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { uuid } from 'dinovel/std/crypto.ts';
import { IObservable, Subject } from "dinovel/std/reactive/__.ts";
import {  DialogResult, DnDialogProps, DialogType, DialogTypeMap, DnDialogComponentProps } from './dialog.model.ts';

export class DialogHandler {
  // deno-lint-ignore no-explicit-any
  private readonly _openDialogs = new Map<string, DnDialogProps<any>>();

  public get openDialogs() {
    return this._openDialogs.values();
  }

  public open<T extends DialogType>(type: T, props: Partial<DnDialogComponentProps>, initialValue?: DialogTypeMap[T]): IObservable<DialogResult<DialogTypeMap[T]>> {
    const result = new Subject<DialogResult<DialogTypeMap[T]>>();

    const p: DnDialogProps<DialogTypeMap[T]> = {
      initialValue,
      type,
      comp: {
        ...props,
        id: props?.id ?? uuid(),
      },
      result: new Subject(),
    };

    p.comp.title = props.title || '';
    p.comp.icon = props.icon || '';
    p.comp.width = props.width || 'auto';
    p.comp.height = props.height || 'auto';
    p.comp.closable = props.closable || false;
    p.comp.modal = props.modal || true;
    p.comp.fixed = props.fixed || true;

    const sub = p.result.subscribe(r => {
      this._openDialogs.delete(p.comp.id);
      result.next(r);
      sub.unsubscribe();
      Dinovel.events.emit('dnDialogClose', { id: p.comp.id, data: r, props: p });
    });

    this._openDialogs.set(p.comp.id, p);
    Dinovel.events.emit('dnDialogOpen', { id: p.comp.id, props: p });

    return result;
  }

  public close<T>(id: string, data: DialogResult<T>): void {
    const p = this._openDialogs.get(id);
    if (p) { p.result.next(data); }
  }
}

export const dialogHandler = new DialogHandler();
