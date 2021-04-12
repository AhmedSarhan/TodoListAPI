import React, { useContext } from 'react';
import { TextField, Button, IconButton, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { TodoType } from '../../utils/Types';
import { AppContext } from './../../Context/AppContext';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '50px auto',
  },
  textField: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  },
  input: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  },
  iconButton: {
    color: '#27ae60',
    backgroundColor: 'transparent',
    border: '1px solid #27ae60',
    borderRadius: 0,
    padding: '7px 5px',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  },
}));
const CreateTodo = ({ refetch }: { refetch: () => void }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm();
  const { userState } = useContext(AppContext);

  const createTodoHandler = async (data: TodoType, e: any) => {
    await axios
      .post(
        '/task',
        {
          description: data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${userState?.token}`,
          },
        }
      )
      .then((res) => {
        e.target.reset();
        refetch();
      })
      .catch((err) => {
        //console.log(err.data);
      });
  };
  return (
    <>
      <form className={classes.root} onSubmit={handleSubmit(createTodoHandler)}>
        <TextField
          className={classes.textField}
          label="todo"
          placeholder="what's on your mind"
          autoFocus
          size="small"
          variant="outlined"
          InputProps={{
            className: classes.input,
          }}
          name="description"
          inputRef={register({
            required: 'Please enter a todo first',
            minLength: {
              value: 3,
              message: 'Todo can not be shorter than 3 characters',
            },
          })}
        />
        <IconButton
          type="submit"
          disableFocusRipple
          size="medium"
          className={classes.iconButton}
        >
          <Add />
        </IconButton>
      </form>
      {errors.description && (
        <Typography variant="caption" color="error" component="p">
          {errors.description?.message}
        </Typography>
      )}
    </>
  );
};

export default CreateTodo;
