import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase-config/firebase-config'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  fullWidth: {
    width: '100%'
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    overflowY: "scroll",
  },
  alignTextCenter: {
    textAlign: 'center'
  }
}));

export default function AlertDialog({ open, handleClose }) {
  const classes = useStyles()
  const usersRef = db.collection('users')
  const [usersSnapshot, loading] = useCollection(usersRef)
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    console.log(checked)
  }, [checked])

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Criar um novo grupo
        </DialogTitle>
        <DialogContent>
          <Grid container direction='column' justify='center' alignItems='center' spacing={3}>
            <Grid item xs={12}>
              <Avatar className={classes.large}>
                <AddAPhotoIcon />
              </Avatar>
            </Grid>
            <Grid item xs={12} className={classes.fullWidth}>
              <TextField
                id="standard-basic"
                label="Digite o nome do grupo"
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={12} className={classes.root}>
              <Typography variant='h6' className={classes.alignTextCenter}>
                Selecione os usuário para o seu grupo
              </Typography>
              <List dense>
                {usersSnapshot?.docs.map((user, index) => {
                  const userData = user.data()
                  return !loading ?
                    <ListItem key={userData.email} button onClick={handleToggle(index)}>
                      <ListItemAvatar>
                        <Avatar
                          alt={`${userData.email} avatar`}
                          src={userData.photoURL}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={userData.email} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          checked={checked.indexOf(index) !== -1}
                          onChange={handleToggle(index)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    :
                    <ListItem key={userData.email} button onClick={handleToggle(index)}>
                      <ListItemAvatar>
                        <Skeleton animation="wave" variant="circle">
                          <Avatar />
                        </Skeleton>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Skeleton animation="wave" variant="text" height={18} width={90}>
                          </Skeleton>
                        }
                      />
                    </ListItem>
                })}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}