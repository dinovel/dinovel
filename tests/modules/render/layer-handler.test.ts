import { mock, modRender, t } from '../../dep.ts';

Deno.test('#LayerHandler', async (steps) => {
  await steps.step('.declare', async (declareSteps) => {
    await declareSteps.step('registers a new layer', () => {
      const mockDocument = mock<Document>().build();

      const layerHandler = new modRender.LayerHandler(mockDocument);

      layerHandler.declare('test');

      t.assert(layerHandler.has('test'));
    });

    await declareSteps.step('use defined id', () => {
      const mockDocument = mock<Document>();

      const layerHandler = new modRender.LayerHandler(mockDocument.build());

      layerHandler.declare('test', { id: 'test-id' });

      mockDocument.assertWasCalledWith('getElementById', 'test-id');
    });

    await declareSteps.step('remove active layers', () => {
      const mockElem = mock<HTMLDivElement>();
      const mockDocument = mock<Document>({
        getElementById: () => mockElem.build(),
      }).build();

      const layerHandler = new modRender.LayerHandler(mockDocument);

      layerHandler.declare('test');

      mockElem.assertWasCalled('remove');
    });
  });

  await steps.step('.hide', async (hideSteps) => {
    await hideSteps.step('remove layer', () => {
      const mockElem = mock<HTMLDivElement>();
      const mockDocument = mock<Document>({
        getElementById: () => mockElem.build(),
      }).build();

      const layerHandler = new modRender.LayerHandler(mockDocument);

      layerHandler.declare('test');
      layerHandler.hide('test');

      mockElem.assertWasCalled('remove');
    });

    await hideSteps.step('do nothing if layer is not declared', () => {
      const mockDocument = mock<Document>();

      const layerHandler = new modRender.LayerHandler(mockDocument.build());

      layerHandler.hide('test');
      mockDocument.assertWasNotCalled('getElementById');
    });

    await hideSteps.step('use defined id', () => {
      const mockDocument = mock<Document>();

      const layerHandler = new modRender.LayerHandler(mockDocument.build());

      layerHandler.declare('test', { id: 'test-id' });
      layerHandler.hide('test');

      mockDocument.assertWasCalledAtWith('getElementById', 1, 'test-id');
    });
  });
});
