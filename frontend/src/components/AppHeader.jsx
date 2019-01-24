import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Fab,
  IconButton
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";
import AppContext from "./AppContext";

const styles = theme => ({
  logoLink: {
    textDecoration: "none",
    color: "#fff"
  }
});

class AppHeader extends React.Component {
  handleBackClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { classes, history } = this.props;
    const isLogIn = history.location.pathname === "/log-in";
    const isSignUp = history.location.pathname === "/sign-up";
    return (
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          {isLogIn || isSignUp ? (
            <IconButton color="inherit" onClick={this.handleBackClick}>
              <ArrowBack />
            </IconButton>
          ) : (
            <Typography variant="button">
              <Link className={classes.logoLink} to="/">
                Easy-rest
              </Link>
            </Typography>
          )}

          {!isSignUp && !isLogIn && <NavMenu />}
          <AppContext.Consumer>
            {state => (
              <UserMenu isLogIn={isLogIn} isSignUp={isSignUp} ctx={state} />
            )}
          </AppContext.Consumer>
        </Toolbar>
      </AppBar>
    );
  }
}

AppHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(AppHeader);
