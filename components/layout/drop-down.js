import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: "#b1b3b5"
  },
  textPrimary: {
    color: "rgba(241, 241, 242, 0.92)",
    fontSize: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
}));

const StyledMenu = withStyles({
  paper: {
    backgroundColor: '#2a2f32',
    border: '1px solid rgba(241, 241, 242, 0.10)'
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function CustomizedMenus({ handleClose, anchorEl, handleStartNewChat, handleStartNewGroup }) {
  const classes = useStyles()

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleStartNewGroup}>
          <ListItemIcon>
            <GroupIcon fontSize="small" className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Iniciar um grupo" className={classes.textPrimary} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleStartNewChat}>
          <ListItemIcon>
            <PersonIcon fontSize="small" className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Iniciar uma conversa" className={classes.textPrimary} />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}