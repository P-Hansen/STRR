<script setup lang="ts">
import type { TableColumn } from '#ui/types'
import type { TableSort } from '~/types/table-sort'
const { disable } = defineProps<{
  column: TableColumn
  sort?: TableSort
  disable?: boolean
}>()

defineEmits<{
  sort: [void]
}>()

const filterModel = defineModel({ type: String, required: true, default: '' })

function handleReset () {
  filterModel.value = ''
}
</script>
<template>
  <div class="flex flex-col divide-y divide-gray-300">
    <TableHeaderLabel
      :column
      :sort
      @sort="$emit('sort')"
    />
    <div class="h-[58px] p-2 font-normal">
      <template v-if="disable">
        <UButton
          variant="select_menu_trigger"
          class="w-full flex-1 justify-between"
          disabled
          :label="column.label"
          trailing-icon="i-mdi-lock"
          :ui="{ label: 'text-center truncate flex-grow-0' }"
        />
      </template>
      <UInput
        v-else
        v-model="filterModel"
        :placeholder="column.label"
        :aria-label="column.label"
        size="sm"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="filterModel"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            class="text-gray-900"
            @click="handleReset"
          />
        </template>
      </UInput>
    </div>
  </div>
</template>
