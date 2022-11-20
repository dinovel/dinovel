import type { Entity } from './entity.ts';
import type { ComponentFactory, ComponentToken } from './component.ts';

export interface System {
  requires: ComponentToken[];
  update?: (tick: DOMHighResTimeStamp, entities: Entity[]) => void;
  draw?: (tick: DOMHighResTimeStamp, entities: Entity[]) => void;
  clear?: (entities: Entity[]) => void;
}

export function createSystem(
  components: ComponentFactory[],
  update?: (tick: DOMHighResTimeStamp, entities: Entity[]) => void,
  draw?: (tick: DOMHighResTimeStamp, entities: Entity[]) => void,
  clear?: (entities: Entity[]) => void,
): System {
  const requires = components.map((c) => c.type);
  return { requires, update, draw, clear };
}
