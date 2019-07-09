#! /usr/bin/env node

/* --------------------------------------------------------------------------------
Script: get-user-contributions.js
Author: Clif Bergmann (skye2k2)
Date: September 2018
Purpose: Retrieve a list of a user's contributions over a specific period of time.
Use: ./get-user-contributions.js
-------------------------------------------------------------------------------- */

var https = require('https');
var fetchCredentials = require('./fetch-credentials.js');

async function get () {
  try {
    this.credentials = await fetchCredentials.get();
    this.users = ['skye2k2'];
    this.users.forEach(async (user) => {
      var release = await fetchContributions(user);
    });
  } catch (err) {
    console.log('Error getting information: ', err);
    return [];
  }
}

// Call the GitHub API to get the last release details.
async function fetchContributions (user) {
  return await new Promise((resolve, reject) => {
    https.get({
      auth: this.credentials.login + ':' + this.credentials.password,
      headers: {'User-Agent': this.credentials.login},
      host: 'api.github.com',
      path: '/users/' + user + '/events',
      port: '443'
    }, (res) => {
      // explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
      res.setEncoding('utf8');

      // incrementally capture the incoming response body
      var data = '';
      res.on('data', function (d) {
        data += d;
      });

      try {
        res.on('end', async () => {
          try {
            var parsed = JSON.parse(data);
          } catch (err) {
            console.error(res.headers);
            console.error('Unable to parse response as JSON');
            return {};
          }

          console.log(parsed.length);

          parsed.forEach((contribution) => {
            if (contribution.type !== 'DeleteEvent') {
              console.log(contribution.type);
            }
          });

          resolve({tag_name: parsed.tag_name, published_at: parsed.published_at});
        });
      } catch (err) {
        console.log(err);
        reject(new Error());
      }
    });
  });
}

get();

module.exports = {
  get,
  fetchContributions
};
