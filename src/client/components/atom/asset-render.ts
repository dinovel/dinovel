import { computed } from 'vue';
import { declareComponent } from 'dinovel/render/declare.ts';
import { obs } from 'dinovel/render/composition.ts';
import { appStore } from '../../store/store.ts';
import { ResourceExtMap } from "dinovel/engine/resources/__.ts";

const template = /*html*/`
<div class="asset-render">
  <audio class="media" v-if="isAudio" controls>
    <source :src="fullPath" :type="'audio/' + ext">
  </audio>
  <img class="media" v-else-if="isImage" :src="fullPath" />
  <video class="media" v-else-if="isVideo" controls>
    <source :src="fullPath" :type="'video/' + ext">
  </video>
  <div v-else class="asset-render__not-supported">
    {{ fullPath }}
  </div>
</div>
`;

export const AssetRender = declareComponent({
  name: 'assetRender',
  template,
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const defResMap: ResourceExtMap = {
      audio: [],
      image: [],
      video: []
    };
    const extMap = obs(appStore.select('resourcesView'), defResMap, e => e.resources.extensions ?? defResMap)
    const ext = computed(() => ((props.path ?? '').split('.').pop() ?? '').toLowerCase());

    function isInArr(arr: string[], v: string) {
      return !!arr.find(e => e.indexOf(v) >= 0);
    }

    const isAudio = computed(() => isInArr(extMap.value.audio, ext.value));
    const isImage = computed(() => isInArr(extMap.value.image, ext.value));
    const isVideo = computed(() => isInArr(extMap.value.video, ext.value));

    const fullPath = computed(() => `/assets/${props.path}`.replaceAll('//', '/'));

    return { ext, isAudio, isImage, isVideo, fullPath };
  }
});
