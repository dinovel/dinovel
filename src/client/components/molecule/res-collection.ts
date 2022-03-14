import { declareComponent } from 'dinovel/render/declare.ts';
import { Ref } from 'dinovel/render/vue-models.ts';
import { DnButtonEvent } from 'dinovel/widgets/__.ts';
import { ref } from 'vue';

const template = /*html*/`
<div class="dn-res-collection">
  <div class="dn-res-collection__top-bar">
    <dn-button-event
      class="dn-button--simple"
      event="noop"
      icon="folderPlus"
      :disabled="showNewGroup"
      @click="showAddNewGroup"
    ></dn-button-event>
  </div>
  <div v-if="showNewGroup" class="dn-res-collection__new">
    <input
      ref="input"
      type="text"
      v-model="newGroupName"
      placeholder="group name"
      @keyup.enter="addNewGroup"
      @keyup.escape="showNewGroup = false"
    />
  </div>
</div>
`;

export const ResCollection = declareComponent({
  template,
  components: { DnButtonEvent },
  setup() {
    const input: Ref<HTMLElement | null> = ref(null);
    const names = ref([]);
    const newGroupName = ref('');
    const showNewGroup = ref(false);

    function addNewGroup() {
      if (!newGroupName.value) return;
      names.value.push(newGroupName.value);
      newGroupName.value = '';
      showNewGroup.value = false;
    }

    function showAddNewGroup() {
      showNewGroup.value = true;
      setTimeout(() => { console.log(input.value) }, 300);
    }

    return {
      showNewGroup,
      newGroupName,
      names,
      addNewGroup,
      showAddNewGroup,
    };
  }
});
