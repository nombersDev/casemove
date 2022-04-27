const { getUsername, setUsername } = require('../settings');

async function isLoggedInElsewhere(userSession) {
  return new Promise((resolve) => {
    userSession.requestRichPresence(
      730,
      [userSession.steamID],
      'english',
      function (err, items) {
        err;
        if (typeof items !== 'undefined') {
          if (Object.keys(items['users']).length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}

module.exports = {
  isLoggedInElsewhere
};
