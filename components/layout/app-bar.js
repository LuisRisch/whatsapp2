import { useState, useContext, useEffect } from 'react'
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
import FormDialog from '../dialogs/find-friends-dialog';
import SignOutDialog from '../dialogs/sign-out-dialog';
import TimeAgo from 'timeago-react'
import Skeleton from '@material-ui/lab/Skeleton';
import { useWindowSize } from '../../helpers/get-window-size'

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
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  textSecondary: {
    color: "rgba(241, 241, 242, 0.63)",
    fontSize: 13,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  avatar: {
    height: 25,
    width: 25
  }
}));

export default function ChatAppBar(props) {
  const windowSize = useWindowSize()
  const classes = useStyles()
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const userChatRef = db.collection('chats').where('users', 'array-contains', userCtx.email)
  const [chatsSnapshot] = useCollection(userChatRef)
  const [textWidth, setTextWidth] = useState(80)
  const [open, setOpen] = useState(false)
  const [openSignOutModal, setOpenSignOutModal] = useState(false)
  const [email, setEmail] = useState("")
  const [errorInEmail, setErrorInEmail] = useState({
    error: false,
    text: ""
  })

  const { friendData, handleDrawerOpen, loading } = props

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
      alert('O usuário foi adiciona a sua lista de conversas. Entretanto, é possível que este usuário não esteja cadastrado em nossa base de dados ainda. Se isso acontecer, ao entrar na conversa com este usuário, aparecerá que ele está indisponível')
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

  useEffect(() => {
    if (windowSize.width >= 550)
      setTextWidth(300)
    else if (windowSize.width >= 350)
      setTextWidth(120)
    else
      setTextWidth(80)
  }, [windowSize])

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
              {
                loading ?
                  <ListItem>
                    <ListItemAvatar>
                      <Skeleton animation="wave" variant="circle">
                        <Avatar />
                      </Skeleton>
                    </ListItemAvatar>
                    <ListItemText
                      primary=
                      {
                        <Skeleton animation="wave" variant="text" height={18} width={90}>
                        </Skeleton>
                      }
                      secondary=
                      {
                        <Skeleton animation="wave" variant="text" height={18} width={90}>
                        </Skeleton>
                      }
                    />
                  </ListItem>
                  :
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
                          <Typography type="body2" className={classes.textPrimary} style={{ width: textWidth }}>
                            {friendData.email}
                          </Typography>
                          :
                          <Typography type="body2" className={classes.textPrimary} style={{ width: textWidth }}>
                            Indisponível
                      </Typography>
                      }

                      secondary=
                      {
                        friendData?.lastSeen?.toDate() ? (
                          <Typography type="body2" className={classes.textSecondary} style={{ width: textWidth }}>
                            <TimeAgo datetime={friendData?.lastSeen?.toDate()} style={{ width: textWidth }} />
                          </Typography>
                        )
                          :
                          <Typography type="body2" className={classes.textSecondary} style={{ width: textWidth }}>
                            Indisponível
                          </Typography>
                      }
                    />
                  </ListItem>
              }
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Avatar
            className={classes.avatar}
            src={userCtx.photoUrl}
            alt="Avatar"
            onClick={handleOpenSignOutModal}
          />
        </Grid>
      </Grid>
    </AppBar>
  )
}