<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTodosStore } from '@/stores';

const { t } = useI18n();
const todosStore = useTodosStore();

const uncompletedTasks = computed(() => todosStore.uncompletedTodos);
const completedTasks = computed(() => todosStore.completedTodos);
const newTodoItem = ref('');

const addTodo = async () => {
  const todoData = {
    id: Date.now(),
    label: newTodoItem.value,
    status: 'uncompleted',
  };

  await todosStore.addTodo(todoData);
  newTodoItem.value = '';
};

const deleteTodo = async (task) => {
  await todosStore.deleteTodo({ todoId: task.key });
};

const changeTaskStatus = async (task) => {
  await todosStore.editTodo({
    data: {
      ...task,
      status: task.status === 'completed' ? 'uncompleted' : 'completed',
    },
    todoId: task.key,
  });
};

onMounted(async () => {
  await todosStore.fetchTodos();
});
</script>

<template>
  <PageTitle>
    {{ t('notes_page.todo_list') }}
  </PageTitle>

  <PageSection class="tw-gap-2">
    <div class="tw-w-full tw-bg-white tw-p-4 tw-rounded-lg">
      <h3
        class="tw-text-lg tw-font-bold tw-border-b-2 tw-border-gray-800 tw-uppercase tw-py-2 tw-mb-0"
      >
        {{ t('notes_page.new_todo') }}
      </h3>

      <div class="tw-flex tw-items-center tw-justify-between tw-mt-4">
        <q-input v-model.trim="newTodoItem" color="black" outlined dense />

        <q-btn
          flat
          no-caps
          color="black"
          :label="t('reuse.add_new')"
          :disable="newTodoItem.length === 0"
          @click="addTodo"
        ></q-btn>
      </div>
    </div>

    <div class="tw-w-full tw-bg-white tw-p-4 tw-rounded-lg">
      <h3
        class="tw-text-lg tw-font-bold tw-border-b-2 tw-border-gray-800 tw-uppercase tw-py-2 tw-mb-0"
      >
        {{ t('notes_page.todo') }}
      </h3>

      <ul id="uncomplete-tasks" class="tw-list-none tw-p-0 tw-m-0">
        <li
          v-for="(uncTask, i) in uncompletedTasks"
          :key="i"
          class="tw-w-full tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-gap-4 tw-py-4 tw-border-b tw-border-gray-200"
        >
          <div
            class="tw-overflow-hidden tw-grid tw-grid-cols-[min-content_auto] tw-items-center tw-gap-4"
          >
            <input
              type="checkbox"
              class="tw-size-4"
              @change="changeTaskStatus(uncTask)"
            />
            <label class="tw-text-lg">
              {{ uncTask.label }}
            </label>
          </div>

          <q-btn
            flat
            no-caps
            color="black"
            :label="t('reuse.delete')"
            @click="deleteTodo(uncTask)"
          />
        </li>
      </ul>
    </div>

    <div class="tw-w-full tw-bg-white tw-p-4 tw-rounded-lg">
      <h3
        class="tw-text-lg tw-font-bold tw-border-b-2 tw-border-gray-800 tw-uppercase tw-py-2 tw-mb-0"
      >
        {{ t('notes_page.completed') }}
      </h3>

      <ul id="completed-tasks" class="tw-list-none tw-p-0 tw-m-0">
        <li
          v-for="(compTask, i) in completedTasks"
          :key="i"
          class="tw-w-full tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-gap-4 tw-py-4 tw-border-b tw-border-gray-200"
        >
          <div
            class="tw-overflow-hidden tw-grid tw-grid-cols-[min-content_auto] tw-items-center tw-gap-4"
          >
            <input
              type="checkbox"
              checked
              class="tw-size-4"
              @change="changeTaskStatus(compTask)"
            />
            <label class="tw-text-lg tw-line-through">
              {{ compTask.label }}
            </label>
          </div>

          <q-btn
            flat
            no-caps
            color="black"
            :label="t('reuse.delete')"
            @click="deleteTodo(compTask)"
          />
        </li>
      </ul>
    </div>
  </PageSection>
</template>
