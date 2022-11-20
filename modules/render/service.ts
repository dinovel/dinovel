import { container, createToken } from '../infra/mod.ts';
import { ColorHandler, IColorHandler } from './color-handler.ts';
import { IStyleBuilder, StyleBuilder } from './style-builder.ts';
import { ILayerHandler, LayerHandler } from './layer-handler.ts';

export const ColorHandlerService = createToken<IColorHandler>('ColorHandlerService', true);
export const StyleBuilderService = createToken<IStyleBuilder>('StyleBuilderService', true);
export const LayerHandlerService = createToken<ILayerHandler>('LayerHandlerService', true);

export const DOMDocument = createToken<Document>('DOMDocument', true);

export function registerColorHandlerService() {
  container.register({
    token: ColorHandlerService,
    factory: [ColorHandler],
  });
}

export function registerStyleBuilderService() {
  container.register({
    token: StyleBuilderService,
    factory: [StyleBuilder],
  });
}

export function registerLayerHandlerService(doc: Document) {
  container.registerValue(DOMDocument, doc);
  container.register({
    token: LayerHandlerService,
    factory: [DOMDocument, LayerHandler],
  });
}
