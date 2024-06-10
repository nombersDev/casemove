# CASEMOVE

*Casemove is an open-source desktop application that helps you easily move items out of and into Storage Units in Counter-Strike 2. The app utilizes the [Steam-user](https://github.com/DoctorMcKay/node-steam-user) & [Global Offensive](https://github.com/DoctorMcKay/node-globaloffensive) libraries to establish a connection with Steam and interact with the CS2 game coordinator.* 

----

## Download Latest Version (Casemove 2.3.5)

This is the latest stable version and can be downloaded from the [releases](https://github.com/nombersDev/casemove/releases) page, or directly from:


- [Windows - (Casemove-2.3.5)](https://github.com/nombersDev/casemove/releases/download/v2.3.5/Casemove-Setup-2.3.5.exe)
- [Mac - (Casemove-2.3.5)](https://github.com/nombersDev/casemove/releases/download/v2.3.5/Casemove-2.3.5.dmg)
- [Mac ARM 64 (M1) - (Casemove-2.3.5)](https://github.com/nombersDev/casemove/releases/download/v2.3.5/Casemove-2.3.5-arm64.dmg)
- [Linux Deb - (Casemove-2.3.5)](https://github.com/nombersDev/casemove/releases/download/v2.3.5/casemove_2.3.5_amd64.deb)
  
## Support

Please join the Casemove discord for support: https://discord.gg/4dSBdt4uJ3

https://user-images.githubusercontent.com/98760010/181345579-e4fd11be-1af9-4b8b-a211-5747fdd414aa.mp4




Features include:
  * An overview page of your storage contents
  * Log in without entering your password / Steam Guard
  * View your inventory
  * View your storage units contents
  * View the Value of your inventory and storage units
  * Move items out of and into your storage units in bulk instead of clicking on the individual items
  * Rename your storage units
  * Sort, search and filter your inventory
  * Sort, search and filter your storage units contents
  * Use your shared secret key instead of an auth code to log in 
  * See your storage unit's and inventory value from SCM in almost all currencies


 
 
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
The app doesn’t interact with your CS2 game client. It doesn’t inject any code into the game. You don’t even need to have the game installed for the app to run. All the app does is connect to Steam and emulate a CS2 connection.

Furthermore, the libraries [Steam-user](https://github.com/DoctorMcKay/node-steam-user) & [Global Offensive](https://github.com/DoctorMcKay/node-globaloffensive) have been used by thousands of people, and this app is merely a cosmetic rendition of these libraries.

#### Does Casemove store any of my information?

No, Casemove doesn’t store any information on your computer, except for when you ask it to remember your refresh token. As of Casemove 2.3.5, Casemove no longer stores your password when you login. The refresh token is stored safely using [safeStore](https://www.electronjs.org/docs/latest/api/safe-storage). Casemove doesn’t send any information to anyone outside of Steam.

#### Why can't I just log in using the Steam Web authentication?

In order to move items in and out of Storage Units, the app needs to have an active connection with the CS2 game coordinator. This is not possible when using the web authentication method. However, take a look at the question below. 

#### How does the browser login work?

The browser login feature works by you logging in to the regular Steam website which makes Steam generate a one time string that you, amongst other things, can use to log in to casemove. This is the safest login method, as the generated string is single use which means that even if someone got a hold of it, it would be useless to them. To get the string open this [URL](https://steamcommunity.com/chat/clientjstoken).

#### Where can I read more about the safety?

Casemove is comparable to the software "Archi Steam Farm" and since Archi has made a terrific wiki on this issue, I'd refer over this wiki for further [reading](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/FAQ#security--privacy--vac--bans--tos)

As with anything, It's important to know that the using this software is distributed "as is" and without any warranty. 

----
## Built using
- Node version 14.18.2
- React Electron Boilerplate
- Tailwind v2
----

## Author

Casemove was created by Nombers.

- Steam: https://steamcommunity.com/id/realNombers/
- Discord: Nombers#1046
----

## License

Please view the license section for more details. 
