import { client } from "./axios";

export const getTodos = () => {
  return client.get("/todos?userId=11128")
};
export const createTodo = (title) => {
  return client.post("/todos", {
    title,
    completed: false,
    userId:11128,
  });
};

export const updateTodo = ({id, title, completed}) => {
  return client.patch(`/todos/${id}`, {
    title,
    completed,
  });
};

export const deleteTodo = (todoId) => {
  return client.delete(`/todos/${todoId}`);
};