import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChatAppBar from '../../components/ui/app-bar'
import DrawerChat from '../../components/ui/drawer'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ChatInputNormal from '../../components/chat-page/chat-input-normal'
import ChatList from '../../components/chat-page/chat-list'
import { db } from '../../firebase-config/firebase-config'
import { useCollection } from 'react-firebase-hooks/firestore'
import UserContext from '../../store/user-context'
import firebase from 'firebase'
import MyMessage from '../../components/chat-page/my-message'
import FriendMessage from '../../components/chat-page/friend-message'
import { getRecipientEmail } from '../../helpers/get-recipient-email'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2F32",
    ...theme.mixins.toolbar,
  },
  content: {
    backgroundColor: "#2A2F32",
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    overflowY: "scroll",
    overflowX: "hidden",
    height: "100%",
    minHeight: "100vh"
  },
  title: {
    color: "rgba(241, 241, 242, 0.95)",
    fontWeight: "lighter",
    textAlign: "center"
  },
  chatLayout: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    overflow: 'hidden',
  },
}));

export default function ChatPage({ chat, messages }) {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.id
  const userCtx = React.useContext(UserContext)
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(id)
      .collection("messages")
      .orderBy('timestamp', 'asc')
  )
  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where("email", "==", getRecipientEmail(chat.users, userCtx.email))
  )

  const recipient = recipientSnapshot?.docs?.[0]?.data()

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        message.data().user === userCtx.email ?
          <MyMessage
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
          :
          <FriendMessage
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
      ))
    }
    else {
      return JSON.parse(messages).map((message) => (
        message.user === userCtx.email ?
          <MyMessage
            key={message.id}
            user={message.user}
            message={message}
          />
          :
          <FriendMessage
            key={message.id}
            user={message.user}
            message={message}
          />
      ))
    }
  }

  const handleSendMessage = (e) => {
    // e.preventDefault()

    // update last seen
    db.collection('users').doc(userCtx.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })

    // send message
    db.collection('chats').doc(id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: userCtx.email,
      photoUrl: userCtx.photoUrl
    })

    setInput("")
  }


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>
          Home
        </title>
        <meta description="Home page with some instructions" name="Home page" />
      </Head>
      <CssBaseline />
      <ChatAppBar handleDrawerOpen={handleDrawerOpen} friendData={recipient} />
      <DrawerChat open={open} handleDrawerClose={handleDrawerClose} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.chatLayout}>
          <ChatList>
            {showMessages()}
          </ChatList>
          <ChatInputNormal
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmitMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id)

  const messagesRes = await ref
    .collection("messages")
    .orderBy('timestamp', 'asc')
    .get()

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }))

  const chatRes = await ref.get()
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  console.log(chat, messages)

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    }
  }
}
