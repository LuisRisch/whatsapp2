import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyD8nR0hUYbi2rc5caZ9Va_B5PwvX_sttGU",
    authDomain: "next-chat-79449.firebaseapp.com",
    databaseURL: "https://next-chat-79449-default-rtdb.firebaseio.com",
    projectId: "next-chat-79449",
    storageBucket: "next-chat-79449.appspot.com",
    messagingSenderId: "690706471394",
    appId: "1:690706471394:web:16b9382cbde1db43f741bb"
  })
} else {
  firebase.app() // if already initialized, use that one
}

export const auth = firebase.auth()
export const db = firebase.firestore()