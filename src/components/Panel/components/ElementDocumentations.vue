<template>
  <el-collapse-item name="element-documentations">
    <template #title>
      <el-icon size="18">
        <ChatLineSquare />
      </el-icon>
      附加文档
    </template>
    <edit-item label="Documentation" :label-width="120">
      <el-input v-model="elementDoc" type="textarea" @change="updateElementDoc" />
    </edit-item>
  </el-collapse-item>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import { getDocumentValue, setDocumentValue } from '@/bo-utils/documentationUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { ChatLineSquare } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementDocumentations',
    components: { ChatLineSquare },
    data() {
      return {
        elementDoc: ''
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    watch: {
      getActiveId: {
        immediate: true,
        handler() {
          this.elementDoc = getDocumentValue(this.getActive as Base) || ''
        }
      }
    },
    mounted() {
      this.elementDoc = getDocumentValue(this.getActive as Base) || ''
      EventEmitter.on('element-update', () => {
        this.elementDoc = getDocumentValue(this.getActive as Base) || ''
      })
    },
    methods: {
      updateElementDoc(value) {
        setDocumentValue(this.getActive as Base, value)
      }
    }
  })
</script>
