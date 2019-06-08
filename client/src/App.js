import React, { Fragment } from 'react';
import {
  withStyles,
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppHeader from './components/AppHeader';
import { Route } from 'react-router-dom';
import FeedsManager from './pages/FeedsManager';
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from "./theme";

const styles = theme => ({
  main: {
    padding: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
});

const App = ({ classes }) => (
    <MuiThemeProvider theme={theme}>
      <Fragment>
        <CssBaseline />
        <AppHeader />
        <main className={classes.main}>
          <Route exact path="/" component={FeedsManager} />
        </main>
      </Fragment>
    </MuiThemeProvider>
);

export default withStyles(styles)(App);