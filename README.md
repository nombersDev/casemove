# CASEMOVE

*Casemove is an open-source desktop application that helps you easily move items out of and into Storage Units in Counter-Strike: Global Offensive. The app utilizes the [Steam-user](https://github.com/DoctorMcKay/node-steam-user) & [Global Offensive](https://github.com/DoctorMcKay/node-globaloffensive) libraries to establish a connection with Steam and interact with the Global Offensive game coordinator.* 

----

## Download Latest Version (Casemove 1.5.4)

This is the latest stable version and can be downloaded from the [releases](https://github.com/nombersDev/casemove/releases) page, or directly from:

- [Windows - (Casemove-1.5.4)](https://github.com/nombersDev/casemove/releases/download/1.5.4/Casemove.Setup.1.5.4.exe)
- [Mac - (Casemove-1.5.4)](https://github.com/nombersDev/casemove/releases/download/1.5.4/Casemove-1.5.4.dmg)
- [Mac ARM 64 (M1) - (Casemove-1.5.4)](https://github.com/nombersDev/casemove/releases/download/1.5.4/Casemove-1.5.4-arm64.dmg)
- [Linux AppImage - (Casemove-1.5.4)](https://github.com/nombersDev/casemove/releases/download/1.5.4/casemove-1.5.4.zip)

Install the Linux version by unzipping the contents of the zip-file into a folder and click on the AppImage file. 

https://user-images.githubusercontent.com/98760010/158956768-69b572f1-43b4-4ab4-a792-77f7a739579f.mp4



https://user-images.githubusercontent.com/98760010/160420993-c62435b7-8962-4c32-bf9d-4fd7455eaec8.mp4



Features include:

  * View your inventory
  * View your storage units contents
  * View the Value of your inventory and storage units
  * Move items out of and into your storage units in bulk instead of clicking on the individual items
  * Rename your storage units
  * Sort, search and filter your inventory
  * Sort, search and filter your storage units contents
  * Download a file over your Storage units and inventory contents
  * Switch between multiple accounts easily
  * Use your shared secret key instead of an auth code to log in 
  * See your storage unit's and inventory value from Buff, Skinport SCM & Bitskins in almost all currencies
  * Dark mode

Trade up features:
  * Complete trade up contracts from within the app! 
  * See the possible outcomes from your trade up contract
  * See an estimated EV of your trade up contract recipe


 
 
----

### How To Use

Use this link to install [Casemove](https://github.com/nombersDev/casemove/releases) 

To use:
  * Download the latest stable version of Casemove
  * Install the application
  * Run the app
  * Log in

----

## COMMON QUESTIONS
#### Can I be VAC banned?

No.
The app doesn’t interact with your CSGO game client. It doesn’t inject any code into the game. You don’t even need to have the game installed for the app to run. All the app does is connect to Steam and emulate a CSGO connection.

Furthermore, the libraries [Steam-user](https://github.com/DoctorMcKay/node-steam-user) & [Global Offensive](https://github.com/DoctorMcKay/node-globaloffensive) have been used by thousands of people, and this app is merely a cosmetic rendition of these libraries.

#### Does Casemove store any of my information?

No, Casemove doesn’t store any information on your computer, except for when you ask it to remember your login information, in which case it stores it safely using [safeStore](https://www.electronjs.org/docs/latest/api/safe-storage). It also doesn’t send any information to anyone outside of Steam.

#### Why can't I just log in using the Steam Web authentication?

In order to move items in and out of Storage Units, the app needs to have an active connection with the CSGO game coordinator. This is not possible when using the web authentication method. 

#### Where can I read more about the safety?

Casemove is comparable to the software "Archi Steam Farm" and since Archi has made a terric wiki on this issue, I'd refer over this wiki for further [reading](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/FAQ#security--privacy--vac--bans--tos)

As with anything, It's important to know that the using this software is distributed "as is" and without any warranty. 

----
## Built using
- Node version 14.18.2
- React Electron Boilerplate
- Tailwind v2
----

## Author

Casemove was created by Nombers.

- Bitcoin donations can be sent to `1Fuy4cX8q739NAtEFexEsZYqza8GVfH9sb`
- Skin donations can be sent [here](https://steamcommunity.com/tradeoffer/new/?partner=1033744096&token=29ggoJY7)

----

## How to build

The main instructions on how to build the application from source be found using the [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) and it's [docs](https://electron-react-boilerplate.js.org/docs/building). 
I've built the app using [NVM](https://github.com/nvm-sh/nvm) with node version 14.18.2. 


----

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License  along with this program.  If not, see http://www.gnu.org/licenses/.


<!--- Frycus will never know this is here ---> 

