
const axios = require('axios');

async function getGithubVersion() {
  return new Promise((resolve) => {
     axios.get('https://api.github.com/repos/nombersDev/casemove/releases').then((response) => {
       const responseData = response.data

       for (const [key, value] of Object.entries(responseData)) {
         if (value.prerelease == false) {
          console.log('githubVersion', value.tag_name.replaceAll('.', ''))
          resolve(value.tag_name.replaceAll('.', ''))
          break
         }
        }
     })
  });
}

module.exports = {
  getGithubVersion
};
