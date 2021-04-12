import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckBoxOutlineBlank, CheckBox, CallSplit } from '@material-ui/icons';
import TodoList from './../components/Todos/TodoList';
import CreateTodo from './../components/Todos/CreateTodo';
import { AppContext } from './../Context/AppContext';
import { TodoType } from '../utils/Types';

const useStyles = makeStyles(() => ({
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  buttonAll: {
    display: 'flex',
    margin: '20px auto',
    padding: '7px 30px',
    color: '#05c46b',
  },
}));
const Home = () => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const { userState } = useContext(AppContext);
  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const [completedState, setCompletedState] = useState<boolean | undefined>(
    undefined
  );
  const [reFetching, setReFetching] = useState<boolean>(false);
  const fetchTodosHandler = async () => {
    await axios
      .get('/task', {
        headers: {
          Authorization: `Bearer ${userState?.token}`,
        },
        params: {
          completed: completedState,
        },
      })
      .then((res) => {
        setTodoList([...res.data.data]);
        setReFetching(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const refetchTodosHandler = (completed: boolean | undefined) => {
    setCompletedState(completed);
    setReFetching(true);
  };
  const firstTimeRender = useRef<boolean>(true);

  useEffect(() => {
    if (!firstTimeRender.current) {
      fetchTodosHandler();
    }
  }, [completedState]);

  useEffect(() => {
    firstTimeRender.current = false;
  }, []);
  const {
    isLoading,
    isError,
    isFetched,
    isFetching,
    refetch,
    data,
    error,
  } = useQuery('todos', fetchTodosHandler);

  if (isLoading) {
    return (
      <Container>
        <h3>Loading...</h3>
      </Container>
    );
  }
  if (isError) {
    return (
      <Container>
        <h5>Error: {error}</h5>
      </Container>
    );
  }
  return (
    <>
      <CreateTodo refetch={refetch} />
      <TodoList todoList={todoList} refetch={refetch} />
      <div className={classes.buttons}>
        <Button
          color="primary"
          startIcon={<CheckBox />}
          onClick={() => refetchTodosHandler(true)}
        >
          Show done Todos
        </Button>
        <Button
          color="secondary"
          startIcon={<CheckBoxOutlineBlank />}
          onClick={() => refetchTodosHandler(false)}
        >
          Show unfinished Todos
        </Button>
      </div>
      <Button
        className={classes.buttonAll}
        color="default"
        startIcon={<CallSplit />}
        onClick={() => refetchTodosHandler(undefined)}
      >
        Fetch All
      </Button>
      {isFetching ||
        (reFetching && (
          <Container>
            <h3>Loading...</h3>
          </Container>
        ))}
    </>
  );
};

export default Home;
