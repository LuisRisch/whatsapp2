import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { useRouter } from 'next/router'
import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase-config/firebase-config'
import UserContext from '../../store/user-context'
import Chat from '../ui/chat'
import { getRecipientEmail } from '../../helpers/get-recipient-email'

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
    overflowX: "hidden"
  },
});

export default function TemporaryDrawer(props) {
  const userCtx = useContext(UserContext)
  const userChatRef = db.collection('chats').where('users', 'array-contains', userCtx.email)
  const [chatsSnapshot] = useCollection(userChatRef)
  const classes = useStyles();
  const router = useRouter();

  function handleClickFriend(name) {
    props.handleDrawerClose()
    router.push(`/chat-page/${name}`)
  }

  const list = () => (
    <div
      className={classes.list}
    >
      <List className={classes.friendList}>
        {
          chatsSnapshot?.docs.map((chat) => (
            <Chat
              id={chat.id}
              friendEmail={getRecipientEmail(chat.data().users, userCtx.email)}
              handleClickFriend={handleClickFriend}
            />
          ))
        }

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
