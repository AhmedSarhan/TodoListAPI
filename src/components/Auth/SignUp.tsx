import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import { AppContext } from './../../Context/AppContext';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    margin: '50px auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px #eee',
    padding: '5px',
    paddingBottom: '25px',
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    padding: '5px',
    margin: '25px auto',
    maxWidth: '95%',
    // backgroundColor: '#ffffff',
  },
  label: {
    left: '20px',
  },
  button: {
    padding: '15px 70px',
  },
}));

type FormData = {
  email: string;
  password: string;
  name: string;
  age: number;
};

const SignUp = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm();
  const [showPassword, setShowPassWord] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined | null>(
    null
  );
  const { dispatchAnewMessage, setUserData, toggleLogIn } = useContext(
    AppContext
  );
  const handleClickShowPassword = () => {
    setShowPassWord((prev) => !prev);
  };
  const signUpHandler = async (data: FormData, e: any) => {
    console.log(data);
    setErrorMessage(null);
    await axios
      .post('/user/register', {
        email: data.email,
        password: data.password,
        name: data.name,
        age: data.age,
      })
      .then((res) => {
        console.log(res.data);
        e.target.reset();
        setErrorMessage(null);
        axios
          .post('/user/login', {
            email: data.email,
            password: data.password,
          })
          .then((res) => {
            console.log(res.data);
            setUserData({ ...res.data });
            toggleLogIn(true);
            setErrorMessage(null);
          });
        dispatchAnewMessage({
          text: 'Registered successfully',
          type: 'success',
        });
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data);
      });
  };
  return (
    <form onSubmit={handleSubmit(signUpHandler)} className={classes.root}>
      <TextField
        className={classes.textField}
        inputRef={register({
          required: 'Please Enter your name first',
          minLength: {
            value: 3,
            message: "Your name can't be shorter than 3 characters",
          },
        })}
        name="name"
        variant="outlined"
        label="Name"
        type="text"
        fullWidth
      />
      {errors.name && (
        <Typography variant="caption" component="p" gutterBottom color="error">
          {errors.name?.message}
        </Typography>
      )}
      <TextField
        className={classes.textField}
        inputRef={register({
          required: 'Please Enter your age first',
          min: {
            value: 1,
            message: "age can't be less than a year",
          },
        })}
        name="age"
        variant="outlined"
        label="age"
        type="number"
        fullWidth
      />
      {errors.age && (
        <Typography variant="caption" component="p" gutterBottom color="error">
          {errors.age?.message}
        </Typography>
      )}
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        fullWidth
      >
        <InputLabel htmlFor="email" className={classes.label}>
          Email Address
        </InputLabel>
        <OutlinedInput
          id="registerEmail"
          type="text"
          labelWidth={100}
          name="email"
          inputRef={register({
            required: 'please Enter an email first',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please Enter a Valid Email',
            },
          })}
        />
        {errors.email ? (
          <Typography
            variant="caption"
            component="p"
            gutterBottom
            color="error"
          >
            {errors.email?.message}
          </Typography>
        ) : (
          <Typography
            variant="caption"
            component="p"
            gutterBottom
            color="primary"
          ></Typography>
        )}
      </FormControl>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        fullWidth
      >
        <InputLabel htmlFor="password" className={classes.label}>
          Password
        </InputLabel>
        <OutlinedInput
          id="registerPassword"
          type={showPassword ? 'text' : 'password'}
          notched={true}
          labelWidth={80}
          name="password"
          inputRef={register({
            required: 'please Enter an email first',
            minLength: {
              value: 5,
              message: "Passwords can't be shorter than 4 characters",
            },
          })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.password ? (
          <Typography
            variant="caption"
            component="p"
            gutterBottom
            color="error"
          >
            {errors.password?.message}
          </Typography>
        ) : (
          <Typography
            variant="caption"
            component="p"
            gutterBottom
            color="primary"
          ></Typography>
        )}
      </FormControl>
      {errorMessage && (
        <Typography variant="caption" component="p" gutterBottom color="error">
          {errorMessage}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Register
      </Button>
    </form>
  );
};

export default SignUp;
