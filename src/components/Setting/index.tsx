import { defineComponent, PropType, ref, toRaw, watch } from 'vue'
import { EditorSettings } from 'types/editor/settings'
import { defaultSettings } from '@/config'
import editor from '@/store/editor'
import LucideIcon from '@/components/common/LucideIcon.vue'

const props = {
  settings: {
    type: Object as PropType<EditorSettings>,
    default: () => defaultSettings
  }
}

const Setting = defineComponent({
  name: 'Setting',
  props: props,
  emits: ['update:settings'],
  setup(props) {
    const modelVisible = ref(false)
    const editorStore = editor()

    const themeColorKeys = [
      'defaultFillColor',
      'defaultStartEventColor',
      'defaultEndEventColor',
      'defaultIntermediateEventColor',
      'defaultIntermediateThrowEventColor',
      'defaultIntermediateCatchEventColor',
      'defaultTaskColor',
      'defaultLabelColor',
      'defaultGatewayColor',
      'defaultSequenceColor'
    ]
    const themeOpacityKeys = [
      'defaultStartEventOpacity',
      'defaultEndEventOpacity',
      'defaultIntermediateThrowEventOpacity',
      'defaultIntermediateCatchEventOpacity',
      'defaultTaskOpacity',
      'defaultLabelOpacity',
      'defaultGatewayOpacity',
      'defaultSequenceOpacity'
    ]
    const editorSettings = ref(props.settings)
    const changeModelVisible = (event) => {
      event.stopPropagation()
      modelVisible.value = !modelVisible.value
    }

    watch(
      () => editorSettings.value,
      () => {
        if (editorSettings.value.penalMode !== 'custom') {
          editorSettings.value.processEngine = 'camunda'
        }
        editorSettings.value && editorStore.updateConfiguration(toRaw(editorSettings.value))
      },
      { deep: true }
    )

    return () => (
      <div>
        <div class="setting" onClick={(e) => e.stopPropagation()}>
          <div class="toggle-button" onClick={changeModelVisible}>
            <LucideIcon name="Settings" size={40} color="#ffffff"></LucideIcon>
          </div>
        </div>
        <el-drawer
          v-model={modelVisible.value}
          size={560}
          title="偏好设置"
          v-slots={{
            footer: () => (
              <div class="tips-message">
                <div class="grip-tips">
                  <p>注：</p>
                  <p>1. 仅自定义模式可使用 activiti 或者 flowable 引擎</p>
                  <p>2. 扩展模式下只能扩展工具按钮，不能删除原有工具</p>
                  <p>3. 自定义的MySql节点只能使用非默认渲染方式</p>
                  <p>4. 🚀🚀🚀付费咨询请添加微信或者关注微信公众号</p>
                </div>
                <p style="font-weight: bold">友情赞助</p>
                <div class="sponsorship-image wechat"></div>
                <div class="sponsorship-image alipay"></div>
              </div>
            )
          }}
        >
          <el-form labelWidth={120} labelPosition="right" size="small">
            <el-form-item label="流程名称：">
              <el-input v-model={editorSettings.value.processName} clearable={true} />
            </el-form-item>
            <el-form-item label="流程ID：">
              <el-input v-model={editorSettings.value.processId} clearable={true} />
            </el-form-item>
            <el-form-item label="工具栏：">
              <el-switch v-model={editorSettings.value.toolbar}></el-switch>
            </el-form-item>
            <el-form-item label="小地图：">
              <el-switch v-model={editorSettings.value.miniMap}></el-switch>
            </el-form-item>
            <el-form-item label="流程校验：">
              <el-switch v-model={editorSettings.value.useLint}></el-switch>
            </el-form-item>
            <el-form-item label="模板选项扩展：">
              <el-switch v-model={editorSettings.value.templateChooser}></el-switch>
            </el-form-item>
            <el-form-item label="右键增强：" feedback="在'模板扩展'下有不同状态">
              <el-switch v-model={editorSettings.value.contextmenu}></el-switch>
            </el-form-item>
            <el-form-item label="自定义右键菜单：">
              <el-switch v-model={editorSettings.value.customContextmenu}></el-switch>
            </el-form-item>
            <el-form-item label="流程引擎：">
              <el-radio-group v-model={editorSettings.value.processEngine}>
                <el-radio label="camunda">Camunda</el-radio>
                <el-radio label="activiti">Activiti</el-radio>
                <el-radio label="flowable">Flowable</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="背景设置：">
              <el-radio-group v-model={editorSettings.value.bg}>
                <el-radio label="grid-image">自定义网格</el-radio>
                <el-radio label="grid">默认网点</el-radio>
                <el-radio label="image">图片</el-radio>
                <el-radio label="none">空</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Penal模式：">
              <el-radio-group v-model={editorSettings.value.penalMode}>
                <el-radio label="default">默认</el-radio>
                <el-radio label="rewrite" disabled={true}>
                  重写版
                </el-radio>
                <el-radio label="custom">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Palette模式：">
              <el-radio-group v-model={editorSettings.value.paletteMode}>
                <el-radio label="default">默认</el-radio>
                <el-radio label="rewrite">重写版</el-radio>
                <el-radio label="enhancement">扩展版</el-radio>
                <el-radio label="custom">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="ContextPad模式：">
              <el-radio-group v-model={editorSettings.value.contextPadMode}>
                <el-radio label="default">默认</el-radio>
                <el-radio label="rewrite">重写版</el-radio>
                <el-radio label="enhancement">扩展版</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Renderer模式：">
              <el-radio-group v-model={editorSettings.value.rendererMode}>
                <el-radio label="default">默认</el-radio>
                <el-radio label="rewrite">重写版</el-radio>
                <el-radio label="enhancement">扩展版</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="其他示例扩展：" feedback="AutoPlace, Rules 等">
              <el-switch v-model={editorSettings.value.otherModule}></el-switch>
            </el-form-item>
            {editorSettings.value.rendererMode === 'rewrite' && (
              <el-form-item label="自定义主题：" class="theme-list" labelPosition="left">
                {themeColorKeys.map((key) => {
                  return (
                    <div class="theme-item">
                      <div class="theme-item_label">{key}：</div>
                      <el-color-picker
                        modes={['hex']}
                        showAlpha={false}
                        v-model={editorSettings.value.customTheme[key]}
                      />
                    </div>
                  )
                })}
                {themeOpacityKeys.map((key) => {
                  return (
                    <div class="theme-item">
                      <div class="theme-item_label">{key}：</div>
                      <el-input-number v-model={editorSettings.value.customTheme[key]} />
                    </div>
                  )
                })}
              </el-form-item>
            )}
          </el-form>
        </el-drawer>
      </div>
    )
  }
})

export default Setting
