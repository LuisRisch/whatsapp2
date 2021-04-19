import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  messagesWrapper: {
    overflowX: 'scroll',
    height: '100%',
    width: '100%',
    paddingBottom: '50px',
  },
  messageWrapper: {
    display: 'flex',
    direction: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "90%",
    margin: "0 auto"
  },
}));

export default function ChatList(props) {
  const classes = useStyles()
  return (
    <div
      className={classes.messagesWrapper}
    >
      <div className={classes.messageWrapper}>
        <ul style={{ width: "100%" }}>
          {props.children}
        </ul>
      </div>
    </div>
  )
}