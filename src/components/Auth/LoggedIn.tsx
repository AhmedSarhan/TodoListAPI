import React, { useContext, useState, useEffect } from 'react';
import { Button, Avatar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { AppContext } from './../../Context/AppContext';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    // width: '150px',
    // height: '150px',
  },
  userLink: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '25px',
    padding: '1px 6px',
    maxHeight: '6vh',
    marginRight: '5px',
    color: '#ffffff',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'rgba(250, 250, 250, 0.1)',
    },
  },
}));
const LoggedIn = () => {
  const classes = useStyles();
  const {
    userState,
    toggleLogIn,
    setUserData,
    dispatchAnewMessage,
    reFetchingAvatar,
  } = useContext(AppContext);
  const [avatarState, setAvatarState] = useState<string | undefined>(undefined);

  const singOutHandler = async () => {
    await axios
      .post(
        '/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${userState?.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toggleLogIn(false);
        setUserData(null);
        localStorage.removeItem('user');
      });
  };
  const fetchAvatarHandler = async () => {
    await axios
      .get(`/user/${userState?._id}/avatar`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        let prefix = 'data:' + res.headers['content-type'] + ';base64,';
        let image = Buffer.from(res.data, 'binary').toString('base64');
        let imageUri = prefix + image;
        setAvatarState(imageUri);
      })
      .catch((err) => {
        // console.log(err.response.data);
        dispatchAnewMessage({
          type: 'error',
          text:
            err?.response?.status === 404
              ? 'No Image found'
              : err?.response?.statusText,
        });
        setAvatarState(undefined);
      });
  };
  useEffect(() => {
    // for better use case maybe the whole fetching logic should have been in the Context but this seemed like a simpler case so it was ignored here
    fetchAvatarHandler();
  }, [reFetchingAvatar]);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <NavLink
        className={classes.userLink}
        activeStyle={{ color: '#2d3436' }}
        to={`/profile/${userState?._id}`}
      >
        <Avatar
          alt={userState?.name}
          src={avatarState ? avatarState : '/broken-image.jpg'}
          className={classes.avatar}
        />
        <h4 style={{ marginLeft: '5px' }}>{userState?.name}</h4>
      </NavLink>
      <Button variant="contained" color="secondary" onClick={singOutHandler}>
        LogOut
      </Button>
    </div>
  );
};

export default LoggedIn;
