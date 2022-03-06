import { registerHandler } from './_create-handler.ts';
import { appStore } from '../../store/store.ts';
import { clearLoading, startLoading, completeLoading } from '../../store/_loading.ts';
import { setResources } from '../../store/_resources.ts';
import { appApi } from '../../api/__.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';

registerHandler('refreshResources', async () => {

  const loadingId = 'refreshResources_loading';

  try {
    appStore.dispatch(clearLoading(loadingId));
    appStore.dispatch(startLoading({
      id: loadingId,
      message: 'Refreshing resource list'
    }));
    const resources = await appApi.resources.loadResources();
    appStore.dispatch(setResources(resources));
  } catch (err) {
    Dinovel.logger.error('Error loading resources', err);
  } finally {
    appStore.dispatch(completeLoading(loadingId));
  }


});
