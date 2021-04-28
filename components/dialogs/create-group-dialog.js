import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { makeStyles } from '@material-ui/core/styles';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase-config/firebase-config'
import { useWindowSize } from '../../helpers/handle-window-size'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  fullWidth: {
    width: '100%'
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  alignCenter: {
    textAlign: 'center'
  },
  userList: {
    height: 300,
    overflowY: 'scroll'
  },
  textPrimary: {
    fontSize: 16,
    width: 180,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

export default function AlertDialog({ open, handleClose }) {
  const classes = useStyles()
  const windowSize = useWindowSize()
  const [checkedFriends, setCheckedFriends] = React.useState([]);
  const [selectedFriendsArray, setSelectedFriendArray] = React.useState([]);
  const [limit, setLimit] = React.useState(5)
  const usersRef = db.collection('users').orderBy('email', 'asc')
  const [usersSnapshot, loading] = useCollection(usersRef.limit(limit))

  const handleToggle = (value) => () => {
    const currentIndex = checkedFriends.indexOf(value);
    const newCheckedFriends = [...checkedFriends];
    const newSelectedFriends = [...selectedFriendsArray];

    if (currentIndex === -1) {
      newCheckedFriends.push(value);
      newSelectedFriends.push({
        email: usersSnapshot?.docs[value].data().email,
        photoURL: usersSnapshot?.docs[value].data().photoURL
      });
    } else {
      newCheckedFriends.splice(currentIndex, 1);
      newSelectedFriends.splice(currentIndex, 1);
    }
    console.log(newSelectedFriends)
    setCheckedFriends(newCheckedFriends);
    setSelectedFriendArray(newSelectedFriends)
  };

  function loadMoreFriend() {
    if (usersSnapshot?.docs.length >= limit)
      setLimit(limit + 5)
  }

  function handleCloseDialog() {
    handleClose()
    setLimit(5)
  }

  function handleCreateGroup() {
    handleClose()
  }

  function handleTextWidth() {
    if (windowSize.width >= 900)
      return (400)
    else if (windowSize.width >= 600)
      return (300)
    else if (windowSize.width >= 352)
      return (170)
    else
      return (130)
  }

  function handleQntAvatars() {
    if (windowSize.width >= 900)
      return (10)
    else if (windowSize.width >= 600)
      return (8)
    else if (windowSize.width >= 352)
      return (5)
    else
      return (4)
  }

  useEffect(() => {

  }, [windowSize])

  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Criar um novo grupo
        </DialogTitle>
        <DialogContent>
          <Grid container direction='column' justify='center' alignItems='center' spacing={3}>
            <Grid item xs={12}>
              <Avatar className={classes.large}>
                <AddAPhotoIcon />
              </Avatar>
            </Grid>
            <Grid item xs={12} className={classes.fullWidth}>
              <TextField
                id="standard-basic"
                label="Digite o nome do grupo"
                multiline
                fullWidth
              />
            </Grid>
            <Grid item >
              <Grid container direction='column' justify='flex-start' alignItems='center' spacing={3}>
                <Grid item>
                  <Typography variant='h6' className={classes.alignCenter}>
                    Selecione os usuário para o seu grupo
                  </Typography>
                </Grid>
                <Grid item>
                  {
                    selectedFriendsArray &&
                    <AvatarGroup max={handleQntAvatars()}>
                      {selectedFriendsArray.map((selectedFriend) => {
                        return <Avatar alt={selectedFriend.email} src={selectedFriend.photoURL} key={selectedFriend.email} />
                      })}
                    </AvatarGroup>
                  }

                </Grid>
                <Grid item>
                  <div className={classes.userList}>
                    <List dense>
                      {usersSnapshot?.docs.map((user, index) => {
                        const userData = user.data()
                        return !loading ?
                          <ListItem key={userData.email} button onClick={handleToggle(index)}>
                            <ListItemAvatar>
                              <Avatar
                                className={classes.small}
                                alt={`${userData.email} avatar`}
                                src={userData.photoURL}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <p className={classes.textPrimary} style={{ width: handleTextWidth() }}>
                                  {userData.email}
                                </p>
                              }
                            />
                          </ListItem>
                          :
                          <ListItem key={userData.email}>
                            <ListItemAvatar>
                              <Skeleton animation="wave" variant="circle">
                                <Avatar
                                  className={classes.small}
                                />
                              </Skeleton>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Skeleton animation="wave" variant="text" height={18} width={90}>
                                </Skeleton>
                              }
                            />
                          </ListItem>
                      })}
                      <button onClick={loadMoreFriend}>
                        Load
                  </button>
                    </List>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateGroup} color="primary" autoFocus>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}