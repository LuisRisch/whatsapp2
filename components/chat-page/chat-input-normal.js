import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  messageInputWrapper: {
    position: 'fixed',
    bottom: 0,
    width: "100%",
  },
  messageInput: {
    paddingTop: theme.spacing(0.6),
    backgroundColor: "#1e2428",
    display: 'flex',
    padding: '5px 10px',
    alignItems: 'center'
  },
  icon: {
    fill: "#828689",
    height: 24,
    width: 24
  },
  input: {
    color: "#f1f1f2",
    backgroundColor: "#33383b",
    border: "1px solid #33383b",
    borderRadius: "21px",
    padding: '10px',
    width: '100%',
    outline: 'none',
    fontSize: '16px',
    height: 50,
  }
}));

export default function ChatInputNormal(props) {
  const classes = useStyles()

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      props.onSubmitMessage(e)
    }
  }

  return (
    <form className={classes.messageInputWrapper}>
      <Paper className={classes.messageInput} elevation={6}>
        <div style={{ display: 'flex', flex: 1 }}>
          <textarea
            placeholder="Digite..."
            className={classes.input}
            onChange={props.onChange}
            value={props.value}
            onKeyDown={handleKeyDown}
            ref={input => input && input.focus()}
          />
        </div>
        <div>
          <IconButton onClick={props.onSubmitMessage}>
            <SendIcon className={classes.icon} />
          </IconButton>
        </div>
      </Paper>
    </form>
  )
}



