import axios from "axios"
import { createCSGOImage } from "../../functionsClasses/createCSGOImage";
export async function getURL(steamID: string): Promise<string | void> {
  let defaultReturnString = createCSGOImage("econ/characters/customplayer_tm_separatist")
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
