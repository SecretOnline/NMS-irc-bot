#NMS-irc-bot

An IRC bot written in Javascript.

Uses the following Node.js modules:

`irc` for irc connection  
`hotload` for auto-loading changes without having to restart the bot

Type `npm install irc hotload` into a console window to install them.  
Once that's done, you're ready to go.

It may be useful to make a batch/bash script to easily start the bot.

**Not included in this repo**

`settings.json`

I wouldn't want to give my password away, would I.

`reports.json`

Crash (and user) reports go here. Make sure this file exists with an empty array in it (`[]`), or it will crash (maybe a little ironic).

##settings.json

``` json
{
  "user": "username for the bot",
  "pass": "password for the bot",
  "clients":[
    {
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
