<template>
  <el-collapse-item name="element-conditional">
    <template #title>
      <el-icon size="18">
        <Operation />
      </el-icon>
      条件设置
    </template>
    <div class="element-conditional">
      <template v-if="varVisible">
        <edit-item key="variableName" label="变量名称" :label-width="120">
          <el-input v-model="variableName" maxlength="32" @change="setElementVariableName" />
        </edit-item>
        <edit-item v-if="varEventVisible" key="variableEvent" label="变量事件" :label-width="120">
          <el-input v-model="variableEvents" @change="setElementVariableEvents" />
        </edit-item>
      </template>
      <edit-item key="condition" label="条件类型" :label-width="120">
        <el-select v-model="conditionData.conditionType" @change="setElementConditionType">
          <el-option
            v-for="item in conditionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </edit-item>
      <edit-item
        v-if="conditionData.conditionType && conditionData.conditionType === 'expression'"
        key="expression"
        label="条件内容"
        :label-width="120"
      >
        <el-input v-model="conditionData.expression" @change="setConditionExpression" />
      </edit-item>
      <template v-if="conditionData.conditionType && conditionData.conditionType === 'script'">
        <edit-item key="scriptType" label="脚本类型" :label-width="120">
          <el-select v-model="conditionData.scriptType" @change="setElementConditionScriptType">
            <el-option
              v-for="item in scriptTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </edit-item>
        <edit-item key="scriptLanguage" label="脚本语言" :label-width="120">
          <el-input v-model="conditionData.language" @change="setConditionScriptLanguage" />
        </edit-item>
        <edit-item
          v-show="conditionData.scriptType === 'inline'"
          key="scriptBody"
          label="脚本内容"
          :label-width="120"
        >
          <el-input v-model="conditionData.body" type="textarea" @change="setConditionScriptBody" />
        </edit-item>
        <edit-item
          v-show="conditionData.scriptType === 'external'"
          key="scriptResource"
          label="资源地址"
          :label-width="120"
        >
          <el-input v-model="conditionData.resource" @change="setConditionScriptResource" />
        </edit-item>
      </template>
    </div>
  </el-collapse-item>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import modeler from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import { scriptTypeOptions } from '@/config/selectOptions'
  import * as CU from '@/bo-utils/conditionUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { Operation } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementConditional',
    components: { Operation },
    setup() {
      const modelerStore = modeler()
      const getActive = computed<Base | null>(() => modelerStore.getActive!)

      // 变量配置部分
      const varVisible = ref<boolean>(false)
      const variableName = ref<string | undefined>(undefined)
      const varEventVisible = ref<boolean>(false)
      const variableEvents = ref<string | undefined>(undefined)
      const getElementVariables = () => {
        varVisible.value = CU.isConditionEventDefinition(getActive.value!)
        variableName.value = CU.getVariableNameValue(getActive.value!)
        if (varVisible.value) {
          varEventVisible.value = !CU.isExtendStartEvent(getActive.value!)
          variableEvents.value = CU.getVariableEventsValue(getActive.value!)
        }
      }
      const setElementVariableName = (value: string | undefined) => {
        CU.setVariableNameValue(getActive.value!, value)
      }
      const setElementVariableEvents = (value: string | undefined) => {
        CU.setVariableEventsValue(getActive.value!, value)
      }

      // 条件类型配置部分
      const conditionTypeOptions = ref<Record<string, string>[]>([])
      const conditionData = ref<ConditionalForm>({})
      const getElementConditionType = () => {
        conditionData.value.conditionType = CU.getConditionTypeValue(getActive.value!)
        conditionData.value.conditionType === 'expression' && getConditionExpression()
        conditionData.value.conditionType === 'script' && getConditionScript()
      }
      const setElementConditionType = (value: string) => {
        CU.setConditionTypeValue(getActive.value!, value)
      }

      const getConditionExpression = () => {
        conditionData.value.expression = CU.getConditionExpressionValue(getActive.value!)
      }
      const setConditionExpression = (value: string | undefined) => {
        CU.setConditionExpressionValue(getActive.value!, value)
      }

      const getConditionScript = () => {
        conditionData.value.language = CU.getConditionScriptLanguageValue(getActive.value!)
        conditionData.value.scriptType = CU.getConditionScriptTypeValue(getActive.value!)
        conditionData.value.body = CU.getConditionScriptBodyValue(getActive.value!)
        conditionData.value.resource = CU.getConditionScriptResourceValue(getActive.value!)
      }
      const setConditionScriptLanguage = (value: string | undefined) => {
        CU.setConditionScriptLanguageValue(getActive.value!, value)
      }
      const setElementConditionScriptType = (value: string | undefined) => {
        CU.setConditionScriptTypeValue(getActive.value!, value)
      }
      const setConditionScriptBody = (value: string | undefined) => {
        CU.setConditionScriptBodyValue(getActive.value!, value)
      }
      const setConditionScriptResource = (value: string | undefined) => {
        CU.setConditionScriptResourceValue(getActive.value!, value)
      }

      onMounted(() => {
        getElementVariables()
        getElementConditionType()
        conditionTypeOptions.value = CU.getConditionTypeOptions(getActive.value!)
        EventEmitter.on('element-update', () => {
          conditionTypeOptions.value = CU.getConditionTypeOptions(getActive.value!)
          getElementVariables()
          getElementConditionType()
        })
      })

      return {
        varVisible,
        varEventVisible,
        variableName,
        variableEvents,
        setElementVariableName,
        setElementVariableEvents,
        conditionTypeOptions,
        conditionData,
        scriptTypeOptions,
        setElementConditionType,
        setConditionExpression,
        setConditionScriptLanguage,
        setElementConditionScriptType,
        setConditionScriptBody,
        setConditionScriptResource
      }
    }
  })
</script>
