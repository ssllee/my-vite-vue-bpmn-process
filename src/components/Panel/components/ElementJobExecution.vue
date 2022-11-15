<template>
  <el-collapse-item name="element-external-task">
    <template #title>
      <el-icon size="18">
        <Notification />
      </el-icon>
      执行作业
    </template>
    <div class="element-external-task">
      <edit-item v-if="tpVisible" label="任务优先级" :label-width="100">
        <el-input v-model="taskPriority" maxlength="32" @change="setExternalTaskPriority" />
      </edit-item>
      <edit-item v-if="rtVisible" label="重试周期" :label-width="100">
        <el-input v-model="retryTimeCycle" maxlength="32" @change="setRetryTimeCycle" />
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue'
  import modeler from '@/store/modeler'
  import {
    getExternalTaskValue,
    getRetryTimeCycleValue,
    retryTimeCycleVisible,
    setExternalTaskValue,
    setRetryTimeCycleValue,
    taskPriorityVisible
  } from '@/bo-utils/jobExecutionUtil'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import { Notification } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementJobExecution',
    components: { Notification },
    setup() {
      const modelerStore = modeler()
      const getActive = computed<Base | null>(() => modelerStore.getActive!)
      const getActiveId = computed<string>(() => modelerStore.getActiveId!)

      const retryTimeCycle = ref<string | undefined>(undefined)
      const rtVisible = ref<boolean>(false)
      const getRetryTimeCycle = () => {
        rtVisible.value = retryTimeCycleVisible(getActive.value!)
        retryTimeCycle.value = getRetryTimeCycleValue(getActive.value!) || ''
      }
      const setRetryTimeCycle = (value: string | undefined) => {
        setRetryTimeCycleValue(getActive.value!, value)
      }

      const taskPriority = ref<string | undefined>(undefined)
      const tpVisible = ref<boolean>(false)
      const getExternalTaskPriority = () => {
        tpVisible.value = taskPriorityVisible(getActive.value!)
        taskPriority.value = getExternalTaskValue(getActive.value!) || ''
      }
      const setExternalTaskPriority = (value: string | undefined) => {
        setExternalTaskValue(getActive.value!, value)
      }

      watch(
        () => getActiveId.value,
        () => {
          getRetryTimeCycle()
          getExternalTaskPriority()
        },
        { immediate: true }
      )

      onMounted(() => {
        getRetryTimeCycle()
        getExternalTaskPriority()

        EventEmitter.on('element-update', () => {
          getRetryTimeCycle()
          getExternalTaskPriority()
        })
      })

      return {
        retryTimeCycle,
        rtVisible,
        setRetryTimeCycle,
        taskPriority,
        tpVisible,
        setExternalTaskPriority
      }
    }
  })
</script>
