import axios from 'axios';
import { GithubResponse } from 'main/interfaces/mainInterfaces';


async function getGithubVersion(platform: string): Promise<GithubResponse> {
  return new Promise((resolve) => {
    axios
      .get('https://api.github.com/repos/nombersDev/casemove/releases')
      .then((response) => {
        const responseData: JSON = response.data;

        for (const [_key, value] of Object.entries(responseData)) {
          if (value.prerelease == false) {
            console.log('githubVersion', value.tag_name.replaceAll('.', ''));
            let downloadLink: string = value['html_url'];
            console.log('Platform: ', platform)

            // Find the relevant download link
            switch (platform) {
              case 'win32':
                value.assets.forEach((element) => {
                  if (element.name.includes('.exe')) {
                    downloadLink = element.browser_download_url;
                  }
                });
                break;

              case 'linux':
                value.assets.forEach((element) => {
                  if (element.name.includes('.zip')) {
                    downloadLink = element.browser_download_url;
                  }
                });
                break;

              default:
                break
            }

            resolve({
              version: parseInt(value.tag_name.replaceAll('.', '')),
              downloadLink: downloadLink,
            });
            break;
          }
        }
      });
  });
}

export { getGithubVersion };
