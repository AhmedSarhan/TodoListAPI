import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import LoggedIn from './../Auth/LoggedIn';
import Login from './../Auth/Login';
import { AppContext } from './../../Context/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();
  const { loggedInState } = useContext(AppContext);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <NavLink
            style={{
              textDecoration: 'none',
              marginRight: '10px',
              color: '#fff',
            }}
            to="/"
          >
            <Typography variant="h4" className={classes.title}>
              TodoList API
            </Typography>
          </NavLink>
          {loggedInState ? <LoggedIn /> : <Login />}
        </Toolbar>
      </AppBar>
    </div>
  );
}
