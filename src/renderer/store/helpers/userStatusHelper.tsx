import axios from "axios"
export async function getURL(steamID: string): Promise<string | void> {
  let defaultReturnString = "https://raw.githubusercontent.com/steamdatabase/gametracking-csgo/108f1682bf7eeb1420caaf2357da88b614a7e1b0/csgo/pak01_dir/resource/flash/econ/characters/customplayer_tm_separatist.png"
    return new Promise<string>((resolve) => {
        axios
        .get(`http://steamcommunity.com/profiles/${steamID}/?xml=1`)
        .then(function(response) {
        const parser = new DOMParser();
        resolve(parser?.parseFromString(response.data,"text/xml")?.getElementsByTagName("profile")[0]?.getElementsByTagName("avatarMedium")[0]?.childNodes[0]?.nodeValue || defaultReturnString
		)
	    })
    }).catch(error => console.log(error));
}
