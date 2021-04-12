import React, { useContext } from 'react';
import './todo.css';
import { Delete } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import axios from 'axios';
import { TodoType } from '../../utils/Types';
import { AppContext } from './../../Context/AppContext';

const Todo = ({ todo, refetch }: { todo: TodoType; refetch: () => void }) => {
  const { userState } = useContext(AppContext);
  const deleteTodoHandler = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    console.log('deleting');
    axios
      .delete(`/task/${todo._id}`, {
        headers: {
          Authorization: `Bearer ${userState?.token}`,
        },
      })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const completeTodoHandler = async (e: React.SyntheticEvent) => {
    console.log('completing');
    axios
      .put(
        `/task/${todo._id}`,
        {
          completed: !todo.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${userState?.token}`,
          },
        }
      )
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className={'todo ' + (todo.completed ? 'completed' : '')}
      onClick={completeTodoHandler}
    >
      <div></div>
      <h3>{todo.description}</h3>
      <IconButton color="secondary" size="medium" onClick={deleteTodoHandler}>
        <Delete />
      </IconButton>
    </div>
  );
};

export default Todo;
