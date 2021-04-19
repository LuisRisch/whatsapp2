import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../firebase-config/firebase-config'
import { useCollection } from 'react-firebase-hooks/firestore'
import UserContext from '../../store/user-context'
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import FormDialog from './find-friends-dialog';
import SignOutDialog from './sign-out-dialog';
import TimeAgo from 'timeago-react'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 71,
    backgroundColor: "#2A2F32",
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sizedBox: {
    width: 5,
  },
  icon: {
    fill: "#b1b3b5"
  },
  textPrimary: {
    color: "rgba(241, 241, 242, 0.92)",
    fontSize: 16,
    width: 80,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  textSecondary: {
    color: "rgba(241, 241, 242, 0.63)",
    fontSize: 13,
    width: 80,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
}));

export default function ChatAppBar(props) {
  const classes = useStyles()
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const userChatRef = db.collection('chats').where('users', 'array-contains', userCtx.email)
  const [chatsSnapshot] = useCollection(userChatRef)
  const [open, setOpen] = useState(false)
  const [openSignOutModal, setOpenSignOutModal] = useState(false)
  const [email, setEmail] = useState("")
  const [errorInEmail, setErrorInEmail] = useState({
    error: false,
    text: ""
  })

  const { friendData, handleDrawerOpen } = props

  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setErrorInEmail({
      error: false,
      text: "",
    })
  }

  function handleEmailInput(event) {
    if (errorInEmail.error)
      setErrorInEmail({
        error: false,
        text: "",
      })
    setEmail(event.target.value)
  }

  function cleanField() {
    setEmail("")
  }

  function chatAlreadyExists(recipientEmail) {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )
  }

  function handleAddFriend() {
    if (email.includes("@") && !chatAlreadyExists(email) && email !== userCtx.email) {
      db.collection('chats').add({
        users: [userCtx.email, email]
      })
      setOpen(false)
    }
    else {
      setErrorInEmail({
        error: true,
        text: "Email inválido ou já existe uma conversa com esse email!"
      })
    }
    cleanField()
  }

  async function handleSignOut() {
    userCtx.signOut()
    router.push("/")
  }

  function handleCloseSignOutModal() {
    setOpenSignOutModal(false)
  }

  function handleOpenSignOutModal() {
    setOpenSignOutModal(true)
  }

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
    >
      <FormDialog
        title="Procure novos amigos!"
        content="Digite o gmail do seu amigo e adicione em sua lista"
        btnLabel1="Adicionar"
        btnLabel2="Cancelar"
        btnFunc1={handleAddFriend}
        btnFunc2={handleClose}
        open={open}
        onChange={handleEmailInput}
        value={email}
        error={errorInEmail.error}
        errorText={errorInEmail.text}
      />
      <SignOutDialog
        title="Sign out"
        content={`Deseja fazer sign out de ${userCtx.name}?`}
        btnLabel1="Sim"
        btnLabel2="Não"
        btnFunc1={handleSignOut}
        btnFunc2={handleCloseSignOutModal}
        open={openSignOutModal}
      />
      <Grid container direction="row" alignItems="center" justify="space-between" style={{ padding: "0 10px" }}>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              >
                <MenuIcon className={classes.icon} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleOpen}
              >
                <SearchIcon className={classes.icon} />
              </IconButton>
            </Grid>
            <div className={classes.sizedBox} />
            <Grid item>
              <ListItem>
                <ListItemAvatar>
                  {
                    friendData ?
                      <Avatar src={friendData.photoURL} />
                      :
                      <Avatar />
                  }
                </ListItemAvatar>
                <ListItemText
                  primary=
                  {
                    friendData ?
                      <Typography type="body2" className={classes.textPrimary}>
                        {friendData.email}
                      </Typography>
                      :
                      <Typography type="body2" className={classes.textPrimary}>
                        Indisponível
                      </Typography>
                  }

                  secondary=
                  {
                    friendData?.lastSeen?.toDate() ? (
                      <Typography type="body2" className={classes.textSecondary}>
                        <TimeAgo datetime={friendData?.lastSeen?.toDate()} />
                      </Typography>
                    )
                      :
                      <Typography type="body2" className={classes.textSecondary}>
                        Indisponível
                      </Typography>
                  }

                />
              </ListItem>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Avatar style={{ height: 25, width: 25 }} src={userCtx.photoUrl} alt="Avatar" onClick={handleOpenSignOutModal} />
        </Grid>
      </Grid>
    </AppBar>
  )
}