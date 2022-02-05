import axios from "axios"
export async function getURL(steamID) {
    return new Promise((resolve,) => {
        axios
        .get(`http://steamcommunity.com/profiles/${steamID}/?xml=1`)
        .then(function(response) {
        const parser = new DOMParser();
        resolve(parser.parseFromString(response.data,"text/xml").getElementsByTagName("profile")[0].getElementsByTagName("avatarMedium")[0].childNodes[0].nodeValue
		)
	    })
    }).catch(error => console.log(error.message));
}