import { declareComponent } from 'dinovel/render/__.ts';
import type { Ref } from 'dinovel/render/vue-models.ts';
import { DnDialog } from 'dinovel/widgets/__.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import type { DnDialogProps } from 'dinovel/dialog/__.ts';
import { ref } from 'vue';

const template = /*html*/`
<div class="dn-dialog-host">

  <template v-for="dialog in dialogList" :key="dialog.comp.id">
    <dn-dialog
      v-if="dialog.type === 'prompt'"
      v-bind="dialog.comp"
      @close="closeDialog(dialog)"
      class="dn-dialog-host--entry"
    >
      <div class="dn-dialog__prompt">
        <input
          class="dn-form__input"
          v-model="stringData[dialog.comp.id]"
          type="text"
          placeholder="Enter value"
        />
      </div>
      <template v-slot:footer>
        <div class="dn-dialog__footer--button-group">
          <button
            class="cancel"
            @click="clickCancel(dialog)"
          >Cancel</button>
          <button
            @click="clickOk(dialog, stringData[dialog.comp.id])"
            :disabled="!stringData[dialog.comp.id]"
          >OK</button>
        </div>
      </template>
    </dn-dialog>
  </template>
</div>
`;

export const DnDialogHost = declareComponent({
  template,
  components: { DnDialog },
  setup() {
    const stringData = ref({});
    const dialogList: Ref<DnDialogProps<unknown>[]> = ref([]);

    Dinovel.events.on('dnDialogOpen', () => {
      dialogList.value = [...Dinovel.dialogs.openDialogs];
      for(const d of dialogList.value) {
        const id = d.comp.id;
        if (!stringData.value[id]) { continue; }
        stringData.value[id] = typeof d.initialValue === 'string' ? d.initialValue : '';
      }
    });
    Dinovel.events.on('dnDialogClose', () => {
      dialogList.value = [...Dinovel.dialogs.openDialogs];
    });

    function closeDialog(p?: DnDialogProps<unknown>): void {
      if (!p) { return; }

      p.result.next({
        id: p.comp.id,
        hasValue: false,
      });
    }

    function clickCancel(p: DnDialogProps<unknown>): void {
      closeDialog(p);
    }

    function clickOk(p: DnDialogProps<unknown>, data: unknown): void {
      p.result.next({
        id: p.comp.id,
        hasValue: true,
        value: data,
      });
    }

    return { dialogList, closeDialog, stringData, clickOk, clickCancel };
  }
});
