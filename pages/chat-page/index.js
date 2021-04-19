import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Image from 'next/image'
import ChatAppBar from '../../components/ui/app-bar'
import DrawerChat from '../../components/ui/drawer'
import Head from 'next/head'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2F32",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    backgroundColor: "#2A2F32",
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowY: "scroll",
    overflowX: "hidden",
    height: "100%",
    minHeight: "100vh"
  },
  title: {
    color: "rgba(241, 241, 242, 0.95)",
    fontWeight: "lighter",
    textAlign: "center"
  }
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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
        <meta description="Hom page with some instructions" name="Home page" />
      </Head>
      <CssBaseline />
      <ChatAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <DrawerChat open={open} handleDrawerClose={handleDrawerClose} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Image src="/images/group.svg" alt="Svg image" height={300} width={300} />
          </Grid>
          <Grid item xs={12}>
            <h1 className={classes.title}>
              Start chatting NOW with your friends!
            </h1>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}