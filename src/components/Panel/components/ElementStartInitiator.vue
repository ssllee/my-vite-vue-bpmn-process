<template>
  <el-collapse-item name="element-start-initiator">
    <template #title>
      <el-icon size="18">
        <Aim />
      </el-icon>
      启动器
    </template>
    <div class="element-start-initiator">
      <edit-item label="Initiator">
        <el-input v-model="initiator" @change="setElementInitiator" />
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import { getInitiatorValue, setInitiatorValue } from '@/bo-utils/initiatorUtil'
  import modeler from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import { Aim } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementStartInitiator',
    components: { Aim },
    setup() {
      const modelerStore = modeler()
      const getActive = computed<Base | null>(() => modelerStore.getActive!)
      const initiator = ref<string | undefined>('')

      const getElementInitiator = () => {
        initiator.value = getInitiatorValue(getActive.value!)
      }
      const setElementInitiator = (value: string | undefined) => {
        setInitiatorValue(getActive.value!, value)
      }

      onMounted(() => {
        getElementInitiator()

        EventEmitter.on('element-update', getElementInitiator)
      })

      return {
        initiator,
        setElementInitiator
      }
    }
  })
</script>
