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

  const handleScroll = (e) => {
    console.log(e)
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log('reached in the bottom')
    }
  }

  return (
    <div
      className={classes.messagesWrapper}
      onScrollCapture={handleScroll}
    >
      <ul className={classes.list} onScrollCapture={handleScroll}>
        {props.children}
      </ul>
    </div>
  )
}