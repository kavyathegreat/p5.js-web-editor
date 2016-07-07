import * as ActionTypes from '../../../constants';
import { browserHistory } from 'react-router';
import axios from 'axios';

const ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:8000/api' : '/api';

export function getProject(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/projects/${id}`, { withCredentials: true })
      .then(response => {
        browserHistory.push(`/projects/${id}`);
        dispatch({
          type: ActionTypes.SET_PROJECT,
          project: response.data,
          files: response.data.files
        });
      })
      .catch(response => dispatch({
        type: ActionTypes.ERROR,
        error: response.data
      }));
  };
}

export function setProjectName(event) {
  const name = event.target.textContent;
  return {
    type: ActionTypes.SET_PROJECT_NAME,
    name
  };
}

export function saveProject() {
  return (dispatch, getState) => {
    const state = getState();
    const formParams = Object.assign({}, state.project);
    formParams.files = state.files;
    if (state.project.id) {
      axios.put(`${ROOT_URL}/projects/${state.project.id}`, formParams, { withCredentials: true })
        .then(() => {
          dispatch({
            type: ActionTypes.PROJECT_SAVE_SUCCESS
          });
        })
        .catch((response) => dispatch({
          type: ActionTypes.PROJECT_SAVE_FAIL,
          error: response.data
        }));
    } else {
      axios.post(`${ROOT_URL}/projects`, formParams, { withCredentials: true })
        .then(response => {
          browserHistory.push(`/projects/${response.data.id}`);
          dispatch({
            type: ActionTypes.NEW_PROJECT,
            name: response.data.name,
            id: response.data.id,
            files: response.data.files
          });
        })
        .catch(response => dispatch({
          type: ActionTypes.PROJECT_SAVE_FAIL,
          error: response.data
        }));
    }
  };
}


export function createProject() {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/projects`, {}, { withCredentials: true })
      .then(response => {
        browserHistory.push(`/projects/${response.data.id}`);
        dispatch({
          type: ActionTypes.NEW_PROJECT,
          name: response.data.name,
          id: response.data.id,
          files: response.data.files
        });
      })
      .catch(response => dispatch({
        type: ActionTypes.PROJECT_SAVE_FAIL,
        error: response.data
      }));
  };
}