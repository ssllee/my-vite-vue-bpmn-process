import { computed, defineComponent, ref } from 'vue'
// import { useDialog } from 'naive-ui'
import LucideIcon from '@/components/common/LucideIcon.vue'
import editor from '@/store/editor'
import modeler from '@/store/modeler'
import ToggleMode from 'bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode'
import EventBus from 'diagram-js/lib/core/EventBus'
import { ElMessageBox } from 'element-plus'

const ExternalTools = defineComponent({
  name: 'ExternalTools',
  setup() {
    const moduleStore = modeler()

    let minimap: any | null = null
    const minimapStatus = computed(() => editor().getEditorConfig.miniMap)
    const minimapToggle = () => {
      !minimap && (minimap = moduleStore.getModeler!.get('minimap'))
      minimap && minimap.toggle()
    }

    const mockSimulation = () => {
      moduleStore.getModeler!.get<ToggleMode>('toggleMode').toggleMode()
    }

    let lintModule: any | null = null
    const lintEnable = computed(() => editor().getEditorConfig.useLint)
    const lintToggle = () => {
      !lintModule && (lintModule = moduleStore.getModeler!.get('linting'))
      lintModule && lintModule.toggle()
    }

    // const shortcutKeysModel = useDialog()
    const shortcutKeysEnable = computed(() => editor().getEditorConfig.otherModule)
    const templateExternal = computed(() => editor().getEditorConfig.templateChooser)
    const openShortcutKeysModel = () => {
      const renderDefault = () => (
        <div class="shortcut-keys-model">
          <p>Undo</p>
          <p>Ctrl + Z</p>
          <p>Redo</p>
          <p>Ctrl + Shift + Z / ctrl + Y</p>
          <p>Select All</p>
          <p>Ctrl + A</p>
          <p>Zoom</p>
          <p>Ctrl + Mouse Wheel</p>
          <p>Scrolling (Vertical)</p>
          <p>Mouse Wheel</p>
          <p>Scrolling (Horizontal)</p>
          <p>Shift + Mouse Wheel</p>
          <p>Direct Editing</p>
          <p>E</p>
          <p>Hand Tool</p>
          <p>H</p>
          <p>Lasso Tool</p>
          <p>L</p>
          <p>Space Tool</p>
          <p>S</p>
        </div>
      )
      const renderTemplateExternal = () => (
        <div class="shortcut-keys-model">
          <p>Replace Tool</p>
          <p>R</p>
          <p>Append anything</p>
          <p>A</p>
          <p>Create anything</p>
          <p>N</p>
        </div>
      )
      // shortcutKeysModel.create({
      //   title: '键盘快捷键',
      //   showIcon: false,
      //   content: () => (
      //     <div>
      //       {renderDefault()}
      //       {templateExternal.value && renderTemplateExternal()}
      //     </div>
      //   )
      // })
      // 待优化 '键盘快捷键'
    }

    // const eventsModel = useDialog()
    const listeners = ref<string[]>([])
    const listenerFilter = ref<string>('')
    const visibleListeners = computed(() =>
      listeners.value.filter((i) => i.includes(listenerFilter.value))
    )
    const openEventsModel = () => {
      const eventBus = moduleStore.getModeler!.get<EventBus>('eventBus')
      listenerFilter.value = ''
      listeners.value = Object.keys(eventBus._listeners).sort()

      // eventsModel.create({
      //   title: '事件列表',
      //   showIcon: false,
      //   content: () => (
      //     <div class="event-listeners-box">
      //       <div class="listener-search">
      //         <NInput v-model={[listenerFilter.value, 'value']} clearable={true}></NInput>
      //       </div>
      //       <div class="event-listeners-box">
      //         {visibleListeners.value &&
      //           visibleListeners.value.map((name, key) => {
      //             return (
      //               <p class="listener-item">
      //                 {key + 1}：{name}
      //               </p>
      //             )
      //           })}
      //       </div>
      //     </div>
      //   )
      // })
      // 待优化 '事件列表'
    }

    return () => (
      <el-button-group>
        <el-button onClick={mockSimulation} title="开启/关闭流程模拟">
          <LucideIcon name="Bot" size={16}></LucideIcon>
        </el-button>
        <el-button onClick={openEventsModel} title="查看bpmn事件">
          <LucideIcon name="Podcast" size={16}></LucideIcon>
        </el-button>
        <el-button onClick={() => minimapToggle()} title="展开/收起小地图">
          <LucideIcon name="Map" size={16}></LucideIcon>
        </el-button>
        {shortcutKeysEnable.value && (
          <el-button onClick={() => openShortcutKeysModel()} title="键盘快捷键">
            <LucideIcon name="Keyboard" size={16}></LucideIcon>
          </el-button>
        )}
      </el-button-group>
    )
  }
})

export default ExternalTools
