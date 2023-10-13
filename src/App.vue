<script>
import StatusFilter from "./components/StatusFilter.vue";
import TodoItem from "./components/TodoItem.vue";
import Message from "./components/Message.vue";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todos";

export default {
  components: {
    StatusFilter,
    TodoItem,
    Message,
  },

  data() {
    return {
      todos: [],
      title: "",
      status: "all",
      errorMessage: "",
    };
  },
  mounted() {
    getTodos()
      .then(({ data }) => {
        this.todos = data;
      })
      .catch(() => {
        this.errorMessage = "Unable to load todos";
      });
  },
  computed: {
    activeTodods() {
      return this.todos.filter((todo) => !todo.completed);
    },
    completedTodods() {
      return this.todos.filter((todo) => todo.completed);
    },
    visibleTodos() {
      switch (this.status) {
        case "active":
          return this.activeTodods;
        case "completed":
          return this.completedTodods;

        default:
          return this.todos;
      }
    },
  },

  methods: {
    handleSubmit() {
      createTodo(this.title).then(({ data }) => {
        this.todos.push(data);
        this.title = "";
      })
      .catch(()=>{
        this.errorMessage = "Unable to create a todo";
      })
    },
    updateTodo({ id, title, completed }) {
      updateTodo({ id, title, completed })
        .then(({ data }) => {
          this.todos = this.todos.map((todo) => (todo.id !== id ? todo : data));
        })
        .catch(() => {
          this.errorMessage = "Unable to update todo";
        });
    },
    deleteTodo(todoId) {
      deleteTodo(todoId).then(() => {
        this.todos = this.todos.filter((todo) => todo.id !== todoId);
      })
      .catch(()=>{
        this.errorMessage = "Unable to delete a todo";
      })
    },
    toggleAll() {
      const allCompleted = this.todos.every(todo => todo.completed);
      this.todos.forEach(todo => {
        todo.completed = !allCompleted;
        this.updateTodo({
          id: todo.id,
          title: todo.title,
          completed: !allCompleted
        });
      });
    }

  },
};
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button
          type="button"
          class="todoapp__toggle-all"
          :class="{ active: activeTodods.length === 0 }"
          @click="toggleAll"
        />

        <form @submit.prevent="handleSubmit">
          <input
            data-cy="NewTodoField"
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
          />
        </form>
      </header>

      <TransitionGroup name="list" tag="section" class="todoapp__main">
        <TodoItem
          :key="todo.id"
          v-for="(todo, index) of visibleTodos"
          :todo="todo"
          @update="updateTodo"
          @delete="deleteTodo(todo.id)"
        />
      </TransitionGroup>

      <footer class="todoapp__footer" data-cy="Footer">
        <span class="todo-count" data-cy="TodosCounter">
          {{ activeTodods.length }} items left
        </span>

        <StatusFilter v-model="status" />

        <button
          type="button"
          class="todoapp__clear-completed"
          v-if="activeTodods.length > 0"
          @click="completedTodods.forEach(todo => deleteTodo(todo.id))"
        >
          Clear completed
        </button>
      </footer>
    </div>

    <Message :active="errorMessage.length > 0" @hide="errorMessage = ''">
      <p>{{ errorMessage }}</p>
    </Message>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  max-height: 60px;
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0px;
  transform: scaleY(0);
}
</style>
