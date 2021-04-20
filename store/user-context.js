import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config/firebase-config'
import firebase from "firebase/app";
import "firebase/auth";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const UserContext = createContext({
  name: "",
  email: "",
  photoUrl: "",
  uid: "",
  isLoading: false,
  signInWithGoogle: () => { },
  signOut: () => { }
});

export function UserContextProvider(props) {
  const classes = useStyles();
  const [snackContent, setSnackContent] = useState({
    open: false,
    message: "",
    icon: "",
  })
  const [activeUser, setActiveUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    auth.onAuthStateChanged((user) => {
      if (user) {
        setActiveUser(user)
        handleSnack(
          true,
          `Seja bem vindo ${user.displayName}`,
          "info",
        )
        handleCatchUserData(user)
      } else {
        setActiveUser(null)
      }
      setIsLoading(false)
    });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    handleSnack(false, "", "")
  };

  const handleSnack = (state, message, icon) => {
    setSnackContent({
      open: state,
      message: message,
      icon: icon,
    })
  }

  const handleCatchUserData = (user) => {
    db.collection('users').doc(user.uid).set({
      email: user.email,
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL: user.photoURL,
    }, { merge: true })
  }

  const signInWithGoogle = async () => {
    if (!activeUser) {
      setIsLoading(true)
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      try {
        const userData = await auth.signInWithPopup(provider);
        setActiveUser(userData.user)
        handleSnack(
          true,
          `${userData.user.displayName} logado com sucesso!`,
          "success",
        )
        setIsLoading(false)
      } catch (error) {
        setActiveUser(null)
        handleSnack(
          true,
          `Erro ao fazer sign out!`,
          "error",
        )
        setIsLoading(false)
      }
    }
  };

  const signOut = async () => {
    if (activeUser) {
      setIsLoading(true)
      try {
        await firebase.auth().signOut();
        setActiveUser(null)
        handleSnack(
          true,
          `Sign out feito com sucesso!`,
          "success",
        )
        setIsLoading(false)
      } catch (error) {
        handleSnack(
          true,
          `Erro ao fazer sign out!`,
          "error",
        )
        setIsLoading(false)
      }
    }
  };

  const context = {
    name: activeUser ? activeUser.displayName : "",
    email: activeUser ? activeUser.email : "",
    photoUrl: activeUser ? activeUser.photoURL : "",
    uid: activeUser ? activeUser.uid : "",
    isLoading: isLoading,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut
  };

  return (
    <UserContext.Provider value={context}>
      <>
        <div className={classes.root}>
          <Snackbar open={snackContent.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackContent.icon}>
              {snackContent.message}
            </Alert>
          </Snackbar>
        </div>
        {props.children}
      </>
    </UserContext.Provider>
  );
}

export default UserContext;
