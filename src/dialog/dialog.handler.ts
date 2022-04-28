import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { uuid } from 'dinovel/std/crypto.ts';
import { IObservable, Subject } from "dinovel/std/reactive/__.ts";
import { ResultDialogProps, DialogResult, DnDialogProps, DialogType, DialogTypeMap } from './dialog.model.ts';

export class DialogHandler {
  // deno-lint-ignore no-explicit-any
  private readonly _openDialogs = new Map<string, ResultDialogProps<any>>();

  public get openDialogs() {
    return this._openDialogs.values();
  }

  public open<T extends DialogType>(type: T, props: Partial<DnDialogProps>): IObservable<DialogResult<DialogTypeMap[T]>> {
    const result = new Subject<DialogResult<DialogTypeMap[T]>>();

    const p: ResultDialogProps<DialogTypeMap[T]> = {
      ...props,
      type,
      id: props?.id ?? uuid(),
      result: new Subject<DialogResult<DialogTypeMap[T]>>(),
    };

    p.title = props.title || '';
    p.icon = props.icon || '';
    p.width = props.width || 'auto';
    p.height = props.height || 'auto';
    p.closable = props.closable || false;
    p.modal = props.modal || true;
    p.fixed = props.fixed || true;

    const sub = p.result.subscribe(r => {
      this._openDialogs.delete(p.id);
      result.next(r);
      sub.unsubscribe();
      Dinovel.events.emit('dnDialogClose', { id: p.id, data: r, props: p });
    });

    this._openDialogs.set(p.id, p);
    Dinovel.events.emit('dnDialogOpen', { id: p.id, props: p });

    return result;
  }

  public close<T>(id: string, data: DialogResult<T>): void {
    const p = this._openDialogs.get(id);
    if (p) { p.result.next(data); }
  }
}

export const dialogHandler = new DialogHandler();
