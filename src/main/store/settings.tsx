const Store = require('electron-store');
const store = new Store();

async function getUsername() {
    const username = store.get("username")

    if (username) return username;
    return ''
}

async function setUsername(username) {
    store.set("username", username)
}

module.exports = {
    getUsername,
    setUsername
}
export{}