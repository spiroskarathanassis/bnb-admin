import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { RequestTodos } from '@/apis/RequestTodos';
import { useMainStore } from '@/stores/useMainStore';
import { DbTypeWithKey } from '@/types';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

interface Todos {
  id: number;
  label: string;
  status: 'completed' | 'uncompleted';
}

export const useTodosStore = defineStore('todos', () => {
  const mainStore = useMainStore();

  const todos = ref<DbTypeWithKey<Todos>[]>([]);

  const uncompletedTodos = computed(() => {
    return todos.value.filter((el) => el.status === 'uncompleted');
  });

  const completedTodos = computed(() => {
    return todos.value.filter((el) => el.status === 'completed');
  });

  const fetchTodos = async () => {
    await RequestTodos.getTodos()
      .then((res: { data?: Record<string, Todos> }) => {
        if (res.data) {
          const freshTodos = requestMapFirebaseData(res.data);
          todos.value = freshTodos;
        }
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };
  const addTodo = async (payload: Todos) => {
    await RequestTodos.addNewTodo(payload)
      .then((res) => {
        const todo = { key: res.data.name, ...payload };
        todos.value.push(todo);
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };
  const deleteTodo = async (payload: { todoId: string }) => {
    await RequestTodos.deleteTodo(payload)
      .then(() => {
        const foundIndex = todos.value.findIndex(
          (el) => el.key === payload.todoId
        );
        todos.value.splice(foundIndex, 1);
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };
  const editTodo = async (payload: {
    data: DbTypeWithKey<Todos>;
    todoId: string;
  }) => {
    await RequestTodos.updateTodo(payload)
      .then(() => {
        const foundIndex = todos.value.findIndex(
          (el) => el.key === payload.data.key
        );
        todos.value.splice(foundIndex, 1, payload.data);
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  return {
    addTodo,
    completedTodos,
    deleteTodo,
    editTodo,
    fetchTodos,
    todos,
    uncompletedTodos,
  };
});
