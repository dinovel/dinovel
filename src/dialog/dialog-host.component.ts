import { declareComponent } from 'dinovel/render/__.ts';
import { DnDialog } from 'dinovel/widgets/__.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import type { ResultDialogProps } from 'dinovel/dialog/__.ts';
import { ref } from 'vue';

const template = /*html*/`
<div class="dn-dialog-host">

  <template v-for="dialog in dialogList" :key="dialog.id">
    <dn-dialog
      v-if="dialog.type === 'prompt'"
      v-bind="dialog"
      @close="closeDialog(dialog)"
      class="dn-dialog-host--entry"
    >
      <div class="dn-dialog__prompt">
        <input
          class="dn-form__input"
          v-model="resData.prompt"
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
            @click="clickOk(dialog, resData.prompt)"
            :disabled="!resData.prompt"
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
    const resData = ref({
      prompt: ''
    });
    const dialogList = ref([]);

    Dinovel.events.on('dnDialogOpen', () => {
      dialogList.value = [...Dinovel.dialogs.openDialogs];
    });
    Dinovel.events.on('dnDialogClose', () => {
      dialogList.value = [...Dinovel.dialogs.openDialogs];
    });

    function closeDialog(p?: ResultDialogProps<unknown>): void {
      if (!p) { return; }

      p.result.next({
        id: p.id,
        hasValue: false,
      });
    }

    function clickCancel(p: ResultDialogProps<unknown>): void {
      closeDialog(p);
    }

    function clickOk(p: ResultDialogProps<unknown>, data: unknown): void {
      p.result.next({
        id: p.id,
        hasValue: true,
        value: data,
      });
    }

    return { dialogList, closeDialog, resData, clickOk, clickCancel };
  }
});
