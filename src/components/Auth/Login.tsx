import React, { useContext, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Typography,
  OutlinedInput,
  Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AppContext } from './../../Context/AppContext';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: '30ch',
    padding: '5px',
    // backgroundColor: '#ffffff',
  },
  label: {
    left: '20px',
  },
  button: {
    backgroundColor: '#ffffff',
    color: '#000',
    padding: '5px 15px',
  },
}));
type FormData = {
  email: string;
  password: string;
};
const Login = () => {
  const classes = useStyles();
  const [showPassword, setShowPassWord] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined | null>(
    null
  );
  const { register, handleSubmit, reset, errors } = useForm<FormData>();
  const { toggleLogIn, setUserData } = useContext(AppContext);

  const handleClickShowPassword = () => {
    setShowPassWord((prev) => !prev);
  };
  const loginHandler = async (data: FormData, e: any) => {
    setErrorMessage(null);
    await axios
      .post('/user/login', {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        //console.log(res.data);
        e.target.reset();
        setUserData({ ...res.data });
        toggleLogIn(true);
        setErrorMessage(null);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data);
      });
  };
  return (
    <>
      <form className={classes.root} onSubmit={handleSubmit(loginHandler)}>
        <FormControl
          className={clsx(classes.margin, classes.textField)}
          color="secondary"
        >
          <InputLabel htmlFor="email" className={classes.label}>
            Email Address
          </InputLabel>
          <OutlinedInput
            id="email"
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
          {errorMessage && (
            <Typography
              variant="caption"
              component="p"
              gutterBottom
              color="error"
            >
              {errorMessage}
            </Typography>
          )}
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
          color="secondary"
        >
          <InputLabel htmlFor="password" className={classes.label}>
            Password
          </InputLabel>
          <OutlinedInput
            id="password"
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
        <Button type="submit" variant="contained" className={classes.button}>
          Login
        </Button>
      </form>
    </>
  );
};

export default Login;
