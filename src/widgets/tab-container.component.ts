import { declareComponent, ComponentDeclaration } from 'dinovel/render/__.ts';
import { computed, watch } from 'vue';
import { Tabs } from "./_models.ts";

const template = /*html*/`
<div class="dn-tab-container" :class="{ 'dn-tab-container--invert': tabsOnTop }">
  <div class="dn-tab-container__tabs">
    <div
      class="dn-tab-container__tab"
      :class="{ 'dn-tab-container__tab--active': tab.id === activeTab }"
      v-for="tab in tabs"
      :key="tab.id"
      @click="onTabClick(tab.id)"
    >{{ tab.name }}</div>
    <div
      class="dn-tab-container__tab--space"
      v-if="tabsOnTop"
    ></div>
  </div>
  <div class="dn-tab-container__content">
    <template v-for="tab in tabs" :key="tab.id">
      <div v-if="tab.id === activeTab" class="dn-tab-container__content-item">
        <slot :name="tab.id"></slot>
      </div>
    </template>
    <template v-if="useDefaultTab">
      <div class="dn-tab-container__content-item dn-tab-container__content-item--default">
        <slot></slot>
      </div>
    </template>
  </div>
</div>
`;

export const TabContainer = declareComponent({
  template,
  props: {
    tabs: {
      type: Array as () => Tabs,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    initialTabId: {
      type: String,
      default: '',
    },
    useDefaultTab: {
      type: Boolean,
      default: false,
    },
    tabsOnTop: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { emit }) {
    const activeTab = computed({
      get: () => props.modelValue,
      set: (value: string) => emit('update:modelValue', value)
    });

    function setInitialTab(initialProp?: string) {
      const initial = initialProp || props.initialTabId || props.tabs[0]?.id || '';
      if (props.tabs.find(tab => tab.id === activeTab.value)) { return }
      activeTab.value = initial;
    }

    function onTabClick(tabId: string) {
      if (tabId === activeTab.value) { return }
      activeTab.value = tabId;
    }

    watch(() => props.tabs, () => setInitialTab());

    return { activeTab, setInitialTab, onTabClick };
  },
  mounted() {
    this.setInitialTab();
  }
});

export default {
  component: TabContainer,
  tagName: 'dn-tab-container',
  description: 'A tab container',
  usageTemplate: /*html*/`
<dn-tab-container tabs="[{ name: 'Tab 1', id: 'tab-1' }, { name: 'Tab 2', id: 'tab-2' }]">
  <template #tab-1>
    <div>Tab 1 content</div>
  </template>
  <template #tab-2>
    <div>Tab 2 content</div>
  </template>
</dn-tab-container>
`
} as ComponentDeclaration;
