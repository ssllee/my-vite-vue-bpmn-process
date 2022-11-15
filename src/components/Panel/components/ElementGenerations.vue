<template>
  <el-collapse-item name="base-info">
    <template #title>
      <el-icon size="18">
        <InfoFilled />
      </el-icon>
      常规信息
    </template>
    <edit-item label="ID">
      <el-input v-model="elementId" maxlength="32" @change="updateElementId" />
    </edit-item>

    <edit-item label="Name">
      <el-input v-model="elementName" maxlength="20" @change="updateElementName" />
    </edit-item>

    <template v-if="isProcess">
      <edit-item key="version" label="Version">
        <el-input v-model="elementVersion" maxlength="20" @change="updateElementVersion" />
      </edit-item>

      <edit-item key="executable" label="Executable">
        <el-switch v-model="elementExecutable" @change="updateElementExecutable" />
      </edit-item>
    </template>
  </el-collapse-item>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import { getNameValue, setNameValue } from '@/bo-utils/nameUtil'
  import { setIdValue } from '@/bo-utils/idUtil'
  import {
    getProcessExecutable,
    getProcessVersionTag,
    setProcessExecutable,
    setProcessVersionTag
  } from '@/bo-utils/processUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { InfoFilled } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementGenerations',
    components: { InfoFilled },
    data() {
      return {
        elementId: '',
        elementName: '',
        elementVersion: '',
        elementExecutable: true,
        isProcess: false
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    mounted() {
      this.reloadGenerationData()
      EventEmitter.on('element-update', this.reloadGenerationData)
    },
    methods: {
      reloadGenerationData() {
        this.isProcess = !!this.getActive && this.getActive.type === 'bpmn:Process'
        this.elementId = this.getActiveId as string
        this.elementName = getNameValue(this.getActive as Base) || ''
        if (this.isProcess) {
          this.elementExecutable = getProcessExecutable(this.getActive as Base)
          this.elementVersion = getProcessVersionTag(this.getActive as Base) || ''
        }
      },
      updateElementName(value: string) {
        setNameValue(this.getActive as Base, value)
      },
      updateElementId(value: string) {
        setIdValue(this.getActive as Base, value)
      },
      updateElementVersion(value: string) {
        const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/
        if (reg.test(value)) {
          setProcessVersionTag(this.getActive as Base, value)
        } else {
          window.__message.error('版本号必须符合语义化版本2.0.0 要点')
        }
      },
      updateElementExecutable(value: boolean) {
        setProcessExecutable(this.getActive as Base, value)
      }
    }
  })
</script>
