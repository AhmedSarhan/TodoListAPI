import React from 'react';
import { TodoType } from '../../utils/Types';
import Todo from './Todo';
const TodoList = ({
  todoList,
  refetch,
}: {
  todoList: TodoType[];
  refetch: () => void;
}) => {
  return (
    <>
      {todoList.length > 0 &&
        todoList.map((todo) => (
          <Todo todo={todo} key={todo._id} refetch={refetch} />
        ))}
    </>
  );
};

export default TodoList;
