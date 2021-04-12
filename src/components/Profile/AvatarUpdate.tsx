import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  makeStyles,
  createStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import {
  IconButton,
  Button,
  MenuProps,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
} from '@material-ui/core';
import { PhotoCamera, Delete, CloudUpload } from '@material-ui/icons';
import { UserType } from '../../utils/Types';
import { AppContext } from './../../Context/AppContext';
// custom styled menu element
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

// custom styled menu item element
const StyledMenuItem = withStyles((theme: Theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

// the classes styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: 'none',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    avatar: {
      width: '150px',
      height: '150px',
    },
    icon: {
      width: '1.5em',
      height: '1.5em',
    },
  })
);

const AvatarUpdate = ({ user }: { user: UserType }) => {
  const classes = useStyles();
  const {
    userState,
    dispatchAnewMessage,
    reFetchingAvatar,
    refetchAvatarHandler,
  } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avatarState, setAvatarState] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<string>('');

  // open the menu
  const openMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // close the menu
  const closeMenuHandler = () => {
    setAnchorEl(null);
  };

  const fetchAvatarHandler = async () => {
    await axios
      .get(`/user/${user?._id}/avatar`, {
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
      });
  };
  // upload the image to server and preview it in the ui
  const updateAvatarHandler = async (image: any) => {
    console.log(image);
    // setSelectedFile(image);
    const formData = new FormData();

    formData.append('avatar', image);
    console.log(formData);
    await axios
      .post('/user/me/avatar', formData, {
        headers: {
          Authorization: `Bearer ${userState?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.succes) {
          fetchAvatarHandler();
          dispatchAnewMessage({
            type: 'success',
            text: 'Avatar was updated successfully',
          });
          refetchAvatarHandler(!reFetchingAvatar);
        } else {
          dispatchAnewMessage({
            type: 'warning',
            text: "Avatar couldn't be updated",
          });
        }
      })
      .catch((err) => {
        dispatchAnewMessage({
          type: 'error',
          text: `Error updating image: ${err.response.data.error}`,
        });
      });
    // close the menu on finish
    closeMenuHandler();
  };

  // delete the avatar
  const deleteAvatarHandler = async () => {
    await axios
      .delete('/user/me/avatar', {
        headers: {
          Authorization: `Bearer ${userState?.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          refetchAvatarHandler(!reFetchingAvatar);
          dispatchAnewMessage({
            type: 'success',
            text: 'Avatar was deleted Successfully',
          });
          setAvatarState(undefined);
        } else {
          dispatchAnewMessage({
            type: 'warning',
            text: "Avatar couldn't be deleted",
          });
        }
      })
      .catch((err) => {
        dispatchAnewMessage({
          type: 'error',
          text: `Error deleting avatar: ${err}`,
        });
      });
    // close the menu on finish
    closeMenuHandler();
  };

  useEffect(() => {
    fetchAvatarHandler();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '40px auto',
        width: '100%',
      }}
    >
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={
          <IconButton
            aria-controls="customized-menu"
            aria-haspopup="true"
            color="primary"
            onClick={openMenuHandler}
            size="medium"
          >
            <PhotoCamera fontSize="large" className={classes.icon} />
          </IconButton>
        }
      >
        <Avatar
          alt={user?.name}
          src={avatarState ? avatarState : '/broken-image.jpg'}
          className={classes.avatar}
        />
      </Badge>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenuHandler}
      >
        <StyledMenuItem>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={(e: any) => updateAvatarHandler(e.target.files[0])}
            value={selectedFile}
          />
          <label htmlFor="contained-button-file" className={classes.label}>
            <ListItemIcon>
              <CloudUpload fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Upload Avatar" />
          </label>
        </StyledMenuItem>
        <StyledMenuItem onClick={deleteAvatarHandler}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete Avatar" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

export default AvatarUpdate;
