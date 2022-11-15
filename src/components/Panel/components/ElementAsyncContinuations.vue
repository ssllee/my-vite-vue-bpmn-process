<template>
  <el-collapse-item name="element-async-continuations">
    <template #title>
      <el-icon size="18">
        <ChatLineSquare />
      </el-icon>
      异步属性
    </template>
    <edit-item label="Before" :label-width="120">
      <el-switch v-model="acBefore" @change="updateElementACBefore" />
    </edit-item>
    <edit-item label="After" :label-width="120">
      <el-switch v-model="acAfter" @change="updateElementACAfter" />
    </edit-item>
    <edit-item v-if="showExclusive" label="Exclusive" :label-width="120">
      <el-switch v-model="acExclusive" @change="updateElementACExclusive" />
    </edit-item>
  </el-collapse-item>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { mapState } from 'pinia'
  import { Base } from 'diagram-js/lib/model'
  import modelerStore from '@/store/modeler'
  import {
    getACAfter,
    getACBefore,
    getACExclusive,
    setACAfter,
    setACBefore,
    setACExclusive
  } from '@/bo-utils/asynchronousContinuationsUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { ChatLineSquare } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementAsyncContinuations',
    components: { ChatLineSquare },
    data() {
      return {
        acBefore: false,
        acAfter: false,
        acExclusive: false
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId']),
      showExclusive() {
        return this.acBefore || this.acAfter
      }
    },
    mounted() {
      this.reloadACStatus()
      EventEmitter.on('element-update', this.reloadACStatus)
    },
    methods: {
      reloadACStatus() {
        this.acBefore = getACBefore(this.getActive as Base)
        this.acAfter = getACAfter(this.getActive as Base)
        this.acExclusive = getACExclusive(this.getActive as Base)
      },
      updateElementACBefore(value: boolean) {
        setACBefore(this.getActive as Base, value)
        this.reloadACStatus()
      },
      updateElementACAfter(value: boolean) {
        setACAfter(this.getActive as Base, value)
        this.reloadACStatus()
      },
      updateElementACExclusive(value: boolean) {
        setACExclusive(this.getActive as Base, value)
        this.reloadACStatus()
      }
    }
  })
</script>
