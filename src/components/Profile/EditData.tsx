import React, { useEffect, useContext, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { UserType } from '../../utils/Types';
import { AppContext } from './../../Context/AppContext';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: '500px',
    display: 'block',
    margin: '20px auto',
  },
  textField: {
    margin: '20px auto',
  },
  button: {
    marginLeft: '10px',
    marginRight: '10px',
    '&:hover': {
      color: '#ffffff',
    },
  },
  dangerButton: {
    '&:hover': {
      backgroundColor: '#f50057',
    },
  },
  primaryButton: {
    '&:hover': {
      backgroundColor: '#3f51b5',
    },
  },
  label: {
    left: '20px',
  },
}));
type FormData = {
  email: string;
  password: string;
  name: string;
  age: number;
};
const EditData = ({
  setIsEditing,
  userData,
  refetch,
}: {
  setIsEditing: (val: boolean) => void;
  userData: UserType;
  refetch: () => void;
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, reset, setValue } = useForm();
  const { userState, setUserData, dispatchAnewMessage } = useContext(
    AppContext
  );
  const [showPassword, setShowPassWord] = useState<boolean>(false);
  const handleClickShowPassword = () => {
    setShowPassWord((prev) => !prev);
  };
  useEffect(() => {
    setValue('name', userData?.name);
    setValue('email', userData?.email);
    setValue('age', userData?.age);
  }, [userData]);

  const editUserDataHandler = async (data: FormData) => {
    await axios
      .put(
        `/user/me`,
        {
          email: data?.email,
          password: data?.password,
          name: data?.name,
          age: data?.age,
        },
        {
          headers: {
            Authorization: `Bearer ${userState?.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data?.success) {
          // console.log({ ...res.data.data });
          refetch();
          setUserData({
            user: {
              name: res.data?.data?.name,
              age: res.data?.data?.age,
              email: res.data?.data?.email,
              _id: res.data?.data?._id,
            },
            token: userState?.token,
          });
          dispatchAnewMessage({
            text: 'Account has been updated successfully',
            type: 'success',
          });
          setIsEditing(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatchAnewMessage({
          text: `Error updating Profile: ${err}`,
          type: 'error',
        });
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(editUserDataHandler)}
        className={classes.root}
      >
        <TextField
          className={classes.textField}
          label="Name"
          name="name"
          type="text"
          variant="outlined"
          fullWidth
          inputRef={register({
            required: 'Please Enter your name first',
            minLength: {
              value: 3,
              message: "your name can't be shorter than 3 characters",
            },
          })}
        />
        {errors.name && (
          <Typography variant="caption" color="error" component="p">
            {errors.name?.message}
          </Typography>
        )}
        <TextField
          className={classes.textField}
          label="Email Address"
          name="email"
          type="text"
          variant="outlined"
          fullWidth
          inputRef={register({
            required: 'Please Enter your email first',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please Enter a Valid Email',
            },
          })}
        />
        {errors.email && (
          <Typography variant="caption" color="error" component="p">
            {errors.email?.message}
          </Typography>
        )}

        <TextField
          className={classes.textField}
          label="Age"
          name="age"
          type="text"
          variant="outlined"
          fullWidth
          inputRef={register({
            required: 'Please Enter your age first',
            min: {
              value: 1,
              message: "age can't be less than a year",
            },
          })}
        />
        {errors.age && (
          <Typography variant="caption" color="error" component="p">
            {errors.age?.message}
          </Typography>
        )}

        <FormControl className={classes.textField} fullWidth>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px auto',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            className={clsx(classes.button, classes.dangerButton)}
            color="secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel Editing
          </Button>
          <Button
            variant="outlined"
            className={clsx(classes.button, classes.primaryButton)}
            color="primary"
            type="submit"
          >
            Update User
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditData;
