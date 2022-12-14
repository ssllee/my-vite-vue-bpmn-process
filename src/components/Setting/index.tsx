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
          title="????????????"
          v-slots={{
            footer: () => (
              <div class="tips-message">
                <div class="grip-tips">
                  <p>??????</p>
                  <p>1. ??????????????????????????? activiti ?????? flowable ??????</p>
                  <p>2. ??????????????????????????????????????????????????????????????????</p>
                  <p>3. ????????????MySql???????????????????????????????????????</p>
                  <p>4. ??????????????????????????????????????????????????????????????????</p>
                </div>
                <p style="font-weight: bold">????????????</p>
                <div class="sponsorship-image wechat"></div>
                <div class="sponsorship-image alipay"></div>
              </div>
            )
          }}
        >
          <el-form labelWidth={120} labelPosition="right" size="small">
            <el-form-item label="???????????????">
              <el-input v-model={editorSettings.value.processName} clearable={true} />
            </el-form-item>
            <el-form-item label="??????ID???">
              <el-input v-model={editorSettings.value.processId} clearable={true} />
            </el-form-item>
            <el-form-item label="????????????">
              <el-switch v-model={editorSettings.value.toolbar}></el-switch>
            </el-form-item>
            <el-form-item label="????????????">
              <el-switch v-model={editorSettings.value.miniMap}></el-switch>
            </el-form-item>
            <el-form-item label="???????????????">
              <el-switch v-model={editorSettings.value.useLint}></el-switch>
            </el-form-item>
            <el-form-item label="?????????????????????">
              <el-switch v-model={editorSettings.value.templateChooser}></el-switch>
            </el-form-item>
            <el-form-item label="???????????????" feedback="???'????????????'??????????????????">
              <el-switch v-model={editorSettings.value.contextmenu}></el-switch>
            </el-form-item>
            <el-form-item label="????????????????????????">
              <el-switch v-model={editorSettings.value.customContextmenu}></el-switch>
            </el-form-item>
            <el-form-item label="???????????????">
              <el-radio-group v-model={editorSettings.value.processEngine}>
                <el-radio label="camunda">Camunda</el-radio>
                <el-radio label="activiti">Activiti</el-radio>
                <el-radio label="flowable">Flowable</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="???????????????">
              <el-radio-group v-model={editorSettings.value.bg}>
                <el-radio label="grid-image">???????????????</el-radio>
                <el-radio label="grid">????????????</el-radio>
                <el-radio label="image">??????</el-radio>
                <el-radio label="none">???</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Penal?????????">
              <el-radio-group v-model={editorSettings.value.penalMode}>
                <el-radio label="default">??????</el-radio>
                <el-radio label="rewrite" disabled={true}>
                  ?????????
                </el-radio>
                <el-radio label="custom">?????????</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Palette?????????">
              <el-radio-group v-model={editorSettings.value.paletteMode}>
                <el-radio label="default">??????</el-radio>
                <el-radio label="rewrite">?????????</el-radio>
                <el-radio label="enhancement">?????????</el-radio>
                <el-radio label="custom">?????????</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="ContextPad?????????">
              <el-radio-group v-model={editorSettings.value.contextPadMode}>
                <el-radio label="default">??????</el-radio>
                <el-radio label="rewrite">?????????</el-radio>
                <el-radio label="enhancement">?????????</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Renderer?????????">
              <el-radio-group v-model={editorSettings.value.rendererMode}>
                <el-radio label="default">??????</el-radio>
                <el-radio label="rewrite">?????????</el-radio>
                <el-radio label="enhancement">?????????</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="?????????????????????" feedback="AutoPlace, Rules ???">
              <el-switch v-model={editorSettings.value.otherModule}></el-switch>
            </el-form-item>
            {editorSettings.value.rendererMode === 'rewrite' && (
              <el-form-item label="??????????????????" class="theme-list" labelPosition="left">
                {themeColorKeys.map((key) => {
                  return (
                    <div class="theme-item">
                      <div class="theme-item_label">{key}???</div>
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
                      <div class="theme-item_label">{key}???</div>
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
