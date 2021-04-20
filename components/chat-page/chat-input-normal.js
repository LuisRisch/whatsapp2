import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  messageInputWrapper: {
    position: 'fixed',
    bottom: 0,
    width: "100%",
  },
  messageInput: {
    paddingTop: theme.spacing.unit * 0.6,
    backgroundColor: "#1e2428",
  },
  icon: {
    fill: "#828689",
    height: 24,
    width: 24
  },
  input: {
    color: "#f1f1f2",
    padding: "9px 12px 11px",
    backgroundColor: "#33383b",
    border: "1px solid #33383b",
    borderRadius: "21px",
    width: "100%",
    minHeight: "20px",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "20px",
    outline: "none",
  }
}));

export default function ChatInputNormal(props) {
  const classes = useStyles()

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      props.onSubmitMessage()
    }
  }

  return (
    <div className={classes.messageInputWrapper}>
      <Paper className={classes.messageInput} elevation={6}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <IconButton>
              <SentimentVerySatisfiedIcon className={classes.icon} />
            </IconButton>
          </Grid>
          <Grid item md={10} xs={8} >
            <textarea
              rows="1"
              placeholder="Digite..."
              className={classes.input}
              onChange={props.onChange}
              value={props.value}
              onKeyDown={handleKeyDown}
              ref={input => input && input.focus()}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={props.onSubmitMessage}>
              <SendIcon className={classes.icon} />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}