<template>
  <el-collapse-item name="element-execution-listeners">
    <template #title>
      <el-icon size="18">
        <Operation />
      </el-icon>
      执行监听 {{ listeners.length }}
    </template>
    <div class="element-extension-listeners">
      <el-table :data="listeners" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="event" label="EventType" :show-overflow-tooltip="true" />
        <el-table-column prop="type" label="ListenerType" :show-overflow-tooltip="true" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="openListenerModel(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button link type="primary" size="small" @click="removeListener(scope.$index)"
              >移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" class="inline-large-button" plain @click="openListenerModel(-1)">
        <lucide-icon :size="20" name="Plus" />
        <span>添加执行监听</span>
      </el-button>
    </div>

    <el-dialog v-model="modelVisible" title="添加执行监听器" width="640px" append-to-body>
      <el-form
        ref="formRef"
        :model="newListener"
        :rules="formRules"
        label-width="auto"
        label-position="top"
        size="small"
      >
        <el-form-item prop="event" label="事件类型( Event Type )">
          <el-select v-model="newListener.event">
            <el-option
              v-for="item in listenerEventTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="监听器类型( Listener Type )">
          <el-select v-model="newListener.type" @change="updateListenerType">
            <el-option
              v-for="item in listenerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'class'"
          prop="class"
          label="Java类( Java Class )"
        >
          <el-input v-model="newListener.class" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'expression'"
          prop="expression"
          label="条件表达式( Expression )"
        >
          <el-input v-model="newListener.expression" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'delegateExpression'"
          path="delegateExpression"
          label="代理条件表达式( Delegate Expression )"
        >
          <el-input v-model="newListener.delegateExpression" @keydown.enter.prevent />
        </el-form-item>
        <template v-if="formItemVisible.listenerType === 'script' && newListener.script">
          <el-form-item
            key="scriptFormat"
            prop="script.scriptFormat"
            label="脚本格式( Script Format )"
          >
            <el-input v-model="newListener.script.scriptFormat" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item key="scriptType" prop="script.scriptType" label="脚本类型( Script Type )">
            <el-select v-model="newListener.script.scriptType" @change="updateScriptType">
              <el-option
                v-for="item in scriptTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'inline'"
            key="scriptContent"
            prop="script.value"
            label="脚本内容( Script Content )"
          >
            <el-input v-model="newListener.script.value" type="textarea" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'external'"
            key="scriptResource"
            path="script.resource"
            label="外链脚本地址( Script Resource )"
          >
            <el-input v-model="newListener.script.resource" @keydown.enter.prevent />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button type="primary" size="small" @click="saveExecutionListener">确认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script lang="ts">
  import { defineComponent, markRaw, ref, computed, nextTick, onMounted } from 'vue'
  import { FormRules } from 'element-plus'
  import modeler from '@/store/modeler'
  import { ModdleElement } from 'bpmn-moddle'
  import { Base } from 'diagram-js/lib/model'
  import {
    addExecutionListener,
    getDefaultEvent,
    getExecutionListeners,
    getExecutionListenerType,
    getExecutionListenerTypes,
    removeExecutionListener,
    updateExecutionListener
  } from '@/bo-utils/executionListenersUtil'
  import { getScriptType } from '@/bo-utils/scriptUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { Operation } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementExecutionListeners',
    components: { Operation },
    setup() {
      const modelerStore = modeler()
      const getActive = computed(() => modelerStore.getActive!)
      const getActiveId = computed<string>(() => modelerStore.getActiveId!)
      let listenersRaw = markRaw([])
      let activeIndex = -1

      const modelVisible = ref(false)
      const listeners = ref<ExecutionListenerForm[]>([])
      const newListener = ref<ExecutionListenerForm>({ event: '', type: 'class' })
      const formRef = ref<HTMLElement | null>(null)
      const formItemVisible = ref<FormItemVisible>({
        listenerType: 'class',
        scriptType: 'none'
      })

      const listenerEventTypeOptions = ref<Record<string, string>[]>([
        { label: 'Start', value: 'start' },
        { label: 'End', value: 'end' },
        { label: 'Take', value: 'take' }
      ])
      const listenerTypeOptions = ref<Record<string, string>[]>([
        { label: 'Java Class', value: 'class' },
        { label: 'Expression', value: 'expression' },
        { label: 'DelegateExpression', value: 'delegateExpression' },
        { label: 'Script', value: 'script' }
      ])
      const scriptTypeOptions = ref<Record<string, string>[]>([
        { label: 'External Resource', value: 'external' },
        { label: 'Inline Script', value: 'inline' },
        { label: 'None', value: 'none' }
      ])
      const formRules: FormRules = {
        event: { required: true, trigger: ['blur', 'change'], message: '事件类型不能为空' },
        type: { required: true, trigger: ['blur', 'change'], message: '监听器类型不能为空' }
      }

      const updateListenerType = (value: string) => {
        formItemVisible.value.listenerType = value
        newListener.value = {
          ...newListener.value,
          type: value,
          ...(value === 'script' ? { script: newListener.value.script || {} } : {})
        }
      }
      const updateScriptType = (value: string) => {
        formItemVisible.value.scriptType = value
        newListener.value.script = {
          scriptFormat: newListener.value.script?.scriptFormat,
          scriptType: value
        }
      }

      const reloadExtensionListeners = () => {
        modelVisible.value = false
        updateListenerType('class')
        newListener.value = { event: getDefaultEvent(getActive.value), type: 'class' }
        listenerEventTypeOptions.value = getExecutionListenerTypes(getActive.value)
        ;(listenersRaw as ModdleElement[]) = markRaw(getExecutionListeners(getActive.value as Base))
        const list = listenersRaw.map(
          (item: ModdleElement & BpmnExecutionListener): ExecutionListenerForm => ({
            ...item,
            ...(item.script
              ? {
                  script: {
                    ...item.script,
                    scriptType: getScriptType(item.script as ModdleElement & BpmnScript)
                  }
                }
              : {}),
            type: getExecutionListenerType(item)
          })
        )
        listeners.value = JSON.parse(JSON.stringify(list))
      }

      const removeListener = (index: number) => {
        const listener: ModdleElement = listenersRaw[index]
        removeExecutionListener(getActive.value, listener)
        reloadExtensionListeners()
      }

      const saveExecutionListener = async () => {
        await (formRef.value as any).validate()
        activeIndex === -1
          ? addExecutionListener(getActive.value, newListener.value)
          : updateExecutionListener(getActive.value, newListener.value, listenersRaw[activeIndex])
        reloadExtensionListeners()
      }

      const openListenerModel = async (index: number, listenerData?: ExecutionListenerForm) => {
        activeIndex = index
        // console.log(index, JSON.stringify(listenerData))
        listenerData && (newListener.value = JSON.parse(JSON.stringify(listenerData)))
        updateListenerType(listenerData?.type || 'class')
        modelVisible.value = true
        await nextTick()
        activeIndex === -1 && formRef.value && (formRef.value as any).resetFields()
      }

      onMounted(() => {
        reloadExtensionListeners()
        EventEmitter.on('element-update', reloadExtensionListeners)
      })

      return {
        modelVisible,
        getActiveId,
        getActive,
        formRef,
        listeners,
        newListener,
        formRules,
        formItemVisible,
        listenerEventTypeOptions,
        listenerTypeOptions,
        scriptTypeOptions,
        removeListener,
        saveExecutionListener,
        openListenerModel,
        updateListenerType,
        updateScriptType
      }
    }
  })
</script>
