import React, { useContext } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppContext } from '../../Context/AppContext';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));
const CustomSnackBarMessage = () => {
  const classes = useStyles();
  const { snackBarState, toggleSnackBarState, messageState } = useContext(
    AppContext
  );

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    toggleSnackBarState(false);
  };
  return (
    <div className={classes.root}>
      <Snackbar
        open={snackBarState}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={messageState.type}>
          {messageState.text}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomSnackBarMessage;
