import { StandardRequest } from './StandardRequest';

export class RequestTodos extends StandardRequest {
  static getTodos = () => {
    const requestPath = `todos.json`;
    return super.GET(requestPath);
  };
  static addNewTodo = (payload) => {
    const requestPath = `todos.json`;
    return super.POST(requestPath, payload);
  };

  static updateTodo = ({ data, todoId }) => {
    const requestPath = `todos/${todoId}.json`;
    return super.UPDATE(requestPath, data);
  };

  static deleteTodo = ({ todoId }) => {
    const requestPath = `todos/${todoId}.json`;
    return super.DELETE(requestPath);
  };
}
