import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { useRouter } from 'next/router'
import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase-config/firebase-config'
import UserContext from '../../store/user-context'
import Chat from './chat'
import { getRecipientEmail } from '../../helpers/get-recipient-email'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import GroupIcon from '@material-ui/icons/Group';
import ChatIcon from '@material-ui/icons/Chat'
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  friendList: {
    backgroundColor: "#2A2F32",
    height: "100%",
    minHeight: "100vh",
    overflowY: "scroll",
  },
  textPrimary: {
    color: "rgba(241, 241, 242, 0.92)",
    fontSize: 16,
  },
  listItem: {
    borderBottom: "1px solid #30383d"
  },
  icon: {
    fill: '#b1b3b5'
  }
});

export default function TemporaryDrawer(props) {
  const userCtx = useContext(UserContext)
  const userChatRef = db.collection('chats').where('users', 'array-contains', userCtx.email)
  const [chatsSnapshot] = useCollection(userChatRef)
  const classes = useStyles();
  const router = useRouter();

  function handleClickFriend(id) {
    props.handleDrawerClose()
    router.push(`/chat-page/${id}`)
  }

  const list = () => (
    <div
      className={classes.list}
    >
      <List className={classes.friendList}>
        <ListItem className={classes.listItem}>
          <Grid container direction='row' alignItems='center' justify='center' spacing={2}>
            <Grid item>
              <ChatIcon className={classes.icon} />
            </Grid>
            <Grid item>
              <Typography type="body2" className={classes.textPrimary}>Conversas</Typography>
            </Grid>
          </Grid>
        </ListItem>
        {
          chatsSnapshot?.docs.map((chat) => (
            <Chat
              key={chat.id}
              id={chat.id}
              friendEmail={getRecipientEmail(chat.data().users, userCtx.email)}
              lastMessage={chat.data().lastMessage}
              timestamp={chat.data().timestamp?.toDate().getTime()}
              handleClickFriend={handleClickFriend}
            />
          ))
        }
        <ListItem className={classes.listItem}>
          <Grid container direction='row' alignItems='center' justify='center' spacing={2}>
            <Grid item>
              <GroupIcon className={classes.icon} />
            </Grid>
            <Grid item>
              <Typography type="body2" className={classes.textPrimary}>Grupos</Typography>
            </Grid>
          </Grid>
        </ListItem>

      </List>
    </div>
  );

  return (
    <div>
      <Drawer open={props.open} onClose={props.handleDrawerClose}>
        {list()}
      </Drawer>
    </div>
  );
}
