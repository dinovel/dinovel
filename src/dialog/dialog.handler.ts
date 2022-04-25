import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { uuid } from 'dinovel/std/crypto.ts';
import { IObservable, Subject } from "dinovel/std/reactive/__.ts";
import { ResultDialogProps, DialogResult, DnDialogProps } from './dialog.model.ts';

export class DialogHandler {
  // deno-lint-ignore no-explicit-any
  private readonly _openDialogs = new Map<string, ResultDialogProps<any>>();

  public get openDialogs(): DnDialogProps[] {
    return Array.from(this._openDialogs.values());
  }

  public open<T>(props: Partial<DnDialogProps>): IObservable<DialogResult<T>> {
    const result = new Subject<DialogResult<T>>();

    const p: ResultDialogProps<T> = {
      ...props,
      id: props?.id ?? uuid(),
      result: new Subject<DialogResult<T>>()
    };

    p.title = props.title || '';
    p.icon = props.icon || '';
    p.width = props.width || '350px';
    p.height = props.height || '200px';
    p.closable = props.closable || false;
    p.modal = props.modal || false;
    p.fixed = props.fixed || false;

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
