#NMS-irc-bot

---

##This repo is still here for legacy purposes. It is now maintained in [secret_bot](https://github.com/SecretOnline/secret_bot) and [IRCord](https://github.com/SecretOnline/IRCord).

---

An IRC bot written in Javascript.

Uses the following Node.js modules:

`irc` for irc connection  
`hotload` for auto-loading changes without having to restart the bot

Run `npm install`  to install them.  
Once that's done, you're ready to go.

It may be useful to make a batch/bash script to easily start the bot.

**Not included in this repo**

`settings.json`

I wouldn't want to give my password away, would I.

`reports.json`

Crash (and user) reports go here.

##settings.json

``` json
{
  "clients":[
    {
      "user": "username for the bot",
      "realName": "another name",
      "pass": "password for the bot",
      "server": "address of a server",
      "channels": [
        "#somechannel"
      ]
    }
  ],
  "admins": [
    "usernames that can do a couple of things"
  ]
}
```

##Contributing

Go ahead.
