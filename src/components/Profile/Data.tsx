import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import { UserType } from '../../utils/Types';
import { AppContext } from './../../Context/AppContext';
import AvatarUpdate from './AvatarUpdate';

const useStyles = makeStyles((theme: Theme) => ({
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
}));
const Data = ({
  setIsEditing,
  userData,
}: {
  setIsEditing: (val: boolean) => void;
  userData: UserType;
}) => {
  const classes = useStyles();
  const { userState, toggleLogIn, dispatchAnewMessage } = useContext(
    AppContext
  );
  const deleteAccountHandler = async () => {
    await axios
      .delete('/user/me', {
        headers: {
          Authorization: `Bearer ${userState?.token}`,
        },
      })
      .then((res) => {
        if (res.data) {
          toggleLogIn(false);
          localStorage.removeItem('user');
          dispatchAnewMessage({
            text:
              'Account has been deleted successfully ... logging you out now',
            type: 'info',
          });
        }
      })
      .catch((err) => {
        //console.log(err);
        dispatchAnewMessage({
          text: `Error deleting Profile: ${err}`,
          type: 'error',
        });
      });
  };
  return (
    <div style={{ margin: '10px auto', maxWidth: '500px' }}>
      <AvatarUpdate user={userData} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px auto',
          alignItems: 'center',
        }}
      >
        <h5 style={{ color: '#808995' }}>Name:</h5>
        <h3>{userData?.name}</h3>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px auto',
          alignItems: 'center',
        }}
      >
        <h5 style={{ color: '#808995' }}>Email:</h5>
        <h3>{userData?.email}</h3>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px auto',
          alignItems: 'center',
        }}
      >
        <h5 style={{ color: '#808995' }}>Age:</h5>
        <h3>{userData?.age}</h3>
      </div>
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
          className={clsx(classes.button, classes.primaryButton)}
          color="primary"
          onClick={() => setIsEditing(true)}
        >
          Edit User
        </Button>
        <Button
          variant="outlined"
          className={clsx(classes.button, classes.dangerButton)}
          color="secondary"
          onClick={deleteAccountHandler}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Data;
