import { declareComponent } from 'dinovel/render/__.ts';
import { DnDialog } from 'dinovel/widgets/dialog.component.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';
import type { ResultDialogProps } from 'dinovel/dialog/__.ts';
import { computed } from 'vue';

const template = /*html*/`
<div class="dn-dialog-host">
  <dn-dialog
    v-for="dialog in openDialogs"
    :key="dialog.id"
    v-bind="dialog"
    @close="closeDialog($event)"
    class="dn-dialog-host--entry"
  />
</div>
`;

export const DnDialogHost = declareComponent({
  template,
  components: { DnDialog },
  setup() {
    const dialogList = computed(() => {
      return Dinovel.dialogs.openDialogs;
    });

    function closeDialog(p?: ResultDialogProps<unknown>): void {
      if (!p) { return; }

      p.result.next({
        id: p.id,
        hasValue: false,
      });
    }

    return { dialogList, closeDialog };
  }
});
