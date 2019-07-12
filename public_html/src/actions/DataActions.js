import axios from 'axios';
import alt from '../alt/alt.js';
import config from '../utils/config';
const vars = config();

class DataActions {
  constructor() {
    const appUrl = vars.url;
    const apiUrl = `${appUrl}/wp-json/wp/v2`;

    this.types = {
      pages: {
        endPoint: `${apiUrl}/pages`
      },
      // posts: {
      //   endPoint: `${apiUrl}/posts`
      // },
      projects: {
        // endPoint: `${apiUrl}/proyecto`
        endPoint: `${appUrl}/wp-json/relatos/v1/get-all-projects`
      },
      tax: {
        endPoint: `${appUrl}/wp-json/relatos/v1/get-taxonomies`
      }
      // media: {
      //   endPoint: `${apiUrl}/media`
      // }
    };
  }

  // Method for getting data from the provided end point url
  api(endPoint) {
    return new Promise((resolve, reject) => {
      axios.get(endPoint).then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  init(cb) {
    let arr = Object.keys(this.types);
    let total = arr.length;
    let payLoad = {};
    let count = 0;

    arr.forEach((key, index) => {
      let postType = key;

      this.api(this.types[postType].endPoint).then((res) => {
        this.types[postType].total = res.headers['x-wp-total'];
        this.types[postType].pages = res.headers['x-wp-totalpages'];
        payLoad[postType] = res.data;
        count++;

        if (count === total) {
          this.getSuccess(payLoad);
          cb(payLoad);
        }
      });
    });

    return false;
  }

  // This returns an object with Pages and Posts data together
  // The Alt Store will listen for this method to fire and will store the returned data
  getSuccess(payload) {
    return payload;
  }
}

export default alt.createActions(DataActions);
