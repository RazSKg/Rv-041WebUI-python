import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {Restaurant, AccountCircle, Work, Feedback, Report, Archive} from '@material-ui/icons';

import ArchivePage from "./ArchiveDataPage";
import Messages from "./MessagesFeedbacksPage";
import GeneralError from "../components/ErrorPages/GeneralError";
import RestaurantsForApprovalPage from "./RestaurantsForApprovalPage";
import Users from "./UsersPage";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});


class PermanentDrawerLeft extends React.Component {

  state = {
    isLoading: true,
    accessAllowed: false,
    error: "",
    token: localStorage.getItem("token"),
    renderingComponent: <RestaurantsForApprovalPage />,
    selectedItemName: "Restaurants",
  };

  components = {
    Restaurants: <RestaurantsForApprovalPage />,
    Users: <Users userStatus="Users"/>,
    Owners: <Users userStatus="Owners"/>,
    Feedbacks: <Messages messageStatus="Feedbacks"/>,
    Reports: <Messages messageStatus="Reports"/>,
    Archive: <ArchivePage archiveStatus="Archive"/>,
  };

  icons = {
    Restaurants: <Restaurant />,
    Users: <AccountCircle />,
    Owners: <Work />,
    Feedbacks: <Feedback />,
    Reports: <Report />,
    Archive: <Archive />,
  };

  classes = this.props.classes;

  componentDidMount() {

      const headers = new Headers({
          'Content-Type': 'application/json',
          'X-Auth-Token': this.state.token
      });

      const fetchInit = {
          method: "GET",
          headers: headers
      };

      fetch('http://localhost:6543/api/moderator', fetchInit)
          .then(response => (!(response.status >= 200 && response.status < 300)
                            ?Promise.reject(response.status)
                            :response.json()))
          .then(data => this.setState({isLoading: false, accessAllowed: data.success}))
          .catch(err => this.setState({isLoading: false, accessAllowed: false, error: "" + err}))
  }

  render() {

    const {isLoading, accessAllowed, error} = this.state;

    if(isLoading){
      return(null);
    }

    if(!accessAllowed){
      return(<GeneralError error={error}/>);
    }

    return (
      <div className={this.classes.root}>
        <Drawer
          className={this.classes.drawer}
          variant="permanent"
          classes={{
            paper: this.classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={this.classes.toolbar} />
          <List>
            {['Restaurants', 'Users', 'Owners', 'Feedbacks', 'Reports'].map((text, index) => (
              <ListItem button
                selected={this.state.selectedItemName === text}
                key={text}
                onClick={() => {
                this.setState({renderingComponent: this.components[text], selectedItemName: text})
                }}>
                <ListItemIcon>{this.icons[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Archive'].map((text, index) => (
              <ListItem button
                selected={this.state.selectedItemName === text}
                key={text}
                onClick={() => {
                this.setState({renderingComponent: this.components[text], selectedItemName: text})
                }}>
                <ListItemIcon>{this.icons[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={this.classes.content}>
          {this.state.renderingComponent}
        </main>
      </div>
    );
  }
}

PermanentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawerLeft);