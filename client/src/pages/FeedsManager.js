import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import './FeedsManager.css';
import {
  withStyles,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { Delete as DeleteIcon,Refresh as UpdateIcon } from '@material-ui/icons';
import moment from 'moment';
import { orderBy } from 'lodash';
import { compose } from 'recompose';

const STableRow = withStyles({
  root:{
    borderRightWidth:0,borderTopWidth:0,borderBottomWidth:1,borderLeftWidth:0,borderColor: '#ccc',borderStyle: 'solid',
  },
  
  hover: {
    '&$hover:hover': {
      backgroundColor:'#fafafa',
      cursor:"pointer"
    },
  }
})(TableRow);

const styles = theme => ({
  
});

const API = 'http://localhost:8080/api';

class FeedsManager extends Component {
  state = {
    loading: true,
    feeds: [],
    hidden: "hidden",
    loadingClass: "",
    cardContent: "Cargando...",
  };

  componentWillMount() {
    this.getFeeds();
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getFeeds() {
    this.setState({ loading: false, feeds: await this.fetch('get', '/feeds') });
      if((this.state.feeds !== void(0) && orderBy(this.state.feeds["data"], ['created_at'], ['desc', 'asc']).filter((feed) => feed.deleted === false ).length > 0) ){
        this.setState({hidden: "",loadingClass: "hidden"});
      }
      else if((this.state.feeds !== void(0) && orderBy(this.state.feeds["data"], ['created_at'], ['desc', 'asc']).filter((feed) => feed.deleted === false ).length === 0)){
        this.setState({cardContent: "No hacker news yet, please wait.",loadingClass: "",hidden: "hidden"});
      }
       else{
        this.setState({hidden: "",cardContent: "Server is down, contact the service provider.",loadingClass: ""});
      }
  }

  async deleteFeed(feed) {
    if (window.confirm(`Are you sure you want to delete "${feed.title ? feed.title : feed.story_title}"`)) {
      await this.fetch('delete', `/feeds/${feed._id}`);
      this.getFeeds();
    }
  }

  render() {
    return (
      <Fragment>
        <Paper elevation={0}>
          <Table>
            <TableBody>
              {(this.state.feeds !== void(0) && orderBy(this.state.feeds["data"], ['created_at'], ['desc', 'asc']).filter((feed) => feed.deleted === false ).length > 0) ? orderBy(this.state.feeds["data"], ['created_at'], ['desc', 'asc']).filter((feed) => feed.deleted === false ).map(feed => (
              <STableRow 
                key={feed._id}
                hover
                >
                <TableCell component="th" scope="row"
                    onClick={(event) => {event.preventDefault(); window.open(feed.title? feed.url : feed.story_url);}}
                    align="right">
                  <Typography
                      style={{display: 'inline-block'}}
                      color="textPrimary"
                      fontSize="13">
                      {feed.title ? feed.title : feed.story_title}
                  </Typography>
                    &nbsp;
                    &nbsp;
                  <Typography 
                      style={{display: 'inline-block'}}
                      color="textSecondary"
                      fontSize="13"
                    >
                      - {feed.author} -
                  </Typography>
                </TableCell>
                <TableCell
                    onClick={(event) => {event.preventDefault(); window.open(feed.title? feed.url : feed.story_url);}}
                    align="right">
                  <Typography 
                      color="textPrimary"
                      fontSize="13"
                    >
                      {moment(feed.created_at).calendar().includes('Today') ? moment(feed.created_at).format('LT') : moment(feed.created_at).calendar()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => this.deleteFeed(feed)} color="inherit">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </STableRow>
              )):
              <TableRow
               >
                <TableCell>
                  <Typography 
                      color="textPrimary"
                      fontSize="13"
                      style={{display: 'inline-block'}}
                    >
                      {this.state.cardContent}  
                  </Typography>
                    &nbsp;
                    &nbsp;
                  <IconButton 
                      style={{display: 'inline-block'}}
                      onClick={() => {window.location.reload();}} color="inherit">
                    <UpdateIcon />
                  </IconButton>
              </TableCell>  
            </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(FeedsManager);