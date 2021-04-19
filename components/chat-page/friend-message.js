import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Grid, Paper } from '@material-ui/core';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "25px 0",
  },
  paper: {
    backgroundColor: "#2a2f32",
    wordBreak: "break-word",
    padding: "1em",
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  text: {
    color: "rgba(241, 241, 242, 0.95)",
    fontSize: "16px",
    fontWeight: "600"
  },
  time: {
    color: "rgba(241, 241, 242, 0.63)",
    fontSize: "16px",
    fontWeight: "500"
  }
}));

export default function FriendMessage({ user, message }) {
  const classes = useStyles()

  return (
    <li className={classes.container}>
      <Paper square elevation={6} className={classes.paper}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                <Avatar src={message.photoUrl} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className={classes.text}>
            {message.message}
          </Grid>

          <Grid item xs={12} className={classes.time}>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                {
                  message.timestamp ? moment(message.timestamp).format('LT') : "..."
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </li>
  )
}