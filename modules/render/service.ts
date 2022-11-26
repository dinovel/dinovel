import { Container, createToken } from '../infra/mod.ts';
import { ColorHandler, IColorHandler } from './color-handler.ts';
import { IStyleBuilder, StyleBuilder } from './style-builder.ts';
import { ILayerHandler, LayerHandler } from './layer-handler.ts';
import { LoggerFactoryService } from '../logger/service.ts';

export const ColorHandlerService = createToken<IColorHandler>('ColorHandlerService', true);
export const StyleBuilderService = createToken<IStyleBuilder>('StyleBuilderService', true);
export const LayerHandlerService = createToken<ILayerHandler>('LayerHandlerService', true);

export const DOMDocument = createToken<Document>('DOMDocument', true);

export function registerColorHandlerService(target: Container) {
  target.register({
    token: ColorHandlerService,
    factory: [ColorHandler],
  });
}

export function registerStyleBuilderService(target: Container) {
  target.register({
    token: StyleBuilderService,
    factory: [LoggerFactoryService, StyleBuilder],
  });
}

export function registerLayerHandlerService(doc: Document, target: Container) {
  target.registerValue(DOMDocument, doc);
  target.register({
    token: LayerHandlerService,
    factory: [DOMDocument, LayerHandler],
  });
}

export function registerRenderServices(doc: Document, target: Container) {
  registerColorHandlerService(target);
  registerStyleBuilderService(target);
  registerLayerHandlerService(doc, target);
}
