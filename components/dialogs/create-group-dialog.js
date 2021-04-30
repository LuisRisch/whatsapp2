import React from 'react';
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
import { useCollection } from 'react-firebase-hooks/firestore';
import { db, storage } from '../../firebase-config/firebase-config';
import { useWindowSize } from '../../helpers/handle-window-size';
import UserContext from '../../store/user-context'

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
  loadButton: {
    width: '100%',
    marginTop: '1em',
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  alignCenter: {
    textAlign: 'center'
  },
  userList: {
    height: 200,
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
  const userCtx = React.useContext(UserContext)
  const [checkedFriends, setCheckedFriends] = React.useState([])
  const [selectedFriendsArray, setSelectedFriendArray] = React.useState([])
  const [input, setInput] = React.useState('')
  const [limit, setLimit] = React.useState(5)
  const [imageAsFile, setImageAsFile] = React.useState('')
  const [imageAsUrl, setImageAsUrl] = React.useState('')
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
    setCheckedFriends([])
    setSelectedFriendArray([])
    setImageAsUrl('')
    setImageAsFile('')
    setInput('')
  }

  function createGroup(firebaseUrl) {
    const friends = [...getFriends()]
    db.collection('groups').add({
      users: friends,
      groupPhoto: firebaseUrl,
      groupName: input
    })
    handleCloseDialog()
  }

  function getFriends() {
    const friends = []
    for (let index = 0; index < selectedFriendsArray.length; index++) {
      const element = selectedFriendsArray[index];
      friends.push(element.email)
    }
    friends.push(userCtx.email)
    return friends
  }

  async function handleCreateGroup(e) {
    e.preventDefault()

    const friends = getFriends()

    if (friends && input.trim().length >= 1)
      handleFireBaseUpload()
    else
      handleCloseDialog()
  }

  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    if (image) {
      setImageAsFile(imageFile => (image))
      setImageAsUrl(URL.createObjectURL(image))
    }
  }

  function handleFireBaseUpload() {
    if (imageAsFile) {
      const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
      //initiates the firebase side uploading 
      uploadTask.on('state_changed',
        (snapShot) => {
          //takes a snap shot of the process as it is happening
          console.log(snapShot)
        }, (err) => {
          //catches the errors
          return false
        }, () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storage.ref('images').child(imageAsFile.name).getDownloadURL()
            .then(fireBaseUrl => {
              createGroup(fireBaseUrl)
            })
            .catch(err => {
              handleCloseDialog()
            })
        })
    }
    else
      createGroup('')
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
              {
                !imageAsUrl ?
                  <>
                    <label for="avatar-file">
                      <Avatar className={classes.large}>
                        <AddAPhotoIcon />
                      </Avatar>
                    </label>
                    <input accept="image/*" id="avatar-file"
                      type="file"
                      onChange={handleImageAsFile}
                      style={{ display: "none" }}
                    />
                  </>
                  :
                  <>
                    <label for="avatar-file">
                      <Avatar src={imageAsUrl} className={classes.large} />
                    </label>
                    <input accept="image/*" id="avatar-file"
                      type="file"
                      onChange={handleImageAsFile}
                      style={{ display: "none" }}
                    />
                  </>
              }
            </Grid>
            <Grid item xs={12} className={classes.fullWidth}>
              <TextField
                id="standard-basic"
                label="Digite o nome do grupo"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item >
              <Grid container direction='column' justify='flex-start' alignItems='center' spacing={1}>
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
                          userCtx.email !== userData.email &&
                          <ListItem key={userData.email} button onClick={handleToggle(index)} >
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
                      <Button onClick={loadMoreFriend} className={classes.loadButton} color='primary' variant="contained">
                        Carregar mais amigos
                      </Button>
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
    </div >
  );
}