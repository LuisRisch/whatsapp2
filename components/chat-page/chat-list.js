import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  messagesWrapper: {
    width: "90%",
    paddingBottom: '50px',
    margin: "0 auto"
  },
  list: {
    display: 'flex',
    flexDirection: 'column-reverse',
  }
}));

export default function ChatList(props) {
  const classes = useStyles()

  return (
    <div
      className={classes.messagesWrapper}
    >
      <ul className={classes.list}>
        {props.children}
      </ul>
    </div>
  )
}