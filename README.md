# RoboQuote

A pretty-bad Discord bot to keep track of memorable quotes; designed with table-top RPG sessions in mind. This is a snapshot of the latest version of RoboQuote, which is a Discord bot I wrote to store and retrieve hilarious things people say during our tabletop RPG sessions.

## Why is RoboQuote pretty bad?

1. RoboQuote works with a Redis key-value database to store JSON data with multiple keys/values per entry. It does this by stringifying the JSON on write, and re-parsing it on read. I set things up this way because Heroku made it really easy to pair a Redis server with an app, and I host RoboQuote on Heroku. Any sane person probably would have used MongoDB or something, but "I can click one button and suddenly my app and my database know about each other" was a hard requirement for me.

2. RoboQuote lets you select a subset of quotes based on the game being played, but has absolutely no verification of input. If you spell the game name wrong when you add the quote, you gotta spell the game name wrong again if you want to select it later. This lack of verification probably creates more nefarious loopholes, too. The biggest security feature RoboQuote has is that it requires the user to send valid JSON as a command line argument through the Discord chat dialog. I'm hoping that most people haven't had the misfortune of working with _that_ much manual JSON creation that they can do this as well as I can.

## How do I use RoboQuote?

You probably shouldn't. But if you want to, it's pretty simple. First, [set your bot up as a Discord app](https://www.freecodecamp.org/news/create-a-discord-bot-with-python/) and invite it to your channel. Then, you need to pair your Discord app to a Redis server running somewhere. I'll leave the database piece as an exercise to the reader, but there are a few tutorials online for pairing your Heroku app to one of the Heroku Redis apps. I probably followed one of those. Then, you can interact with RoboQuote in a few ways.

You should probably start by adding a quote:

`!addquote --quote {"game": "PathFinder", "author": "dan", "content": "Flavortown?!"}`

The thing after `--quote` has to be valid JSON, or RoboQuote will complain at you.

Once you have some quotes in your database, you can do two things:

* `!rq` will pull a random quote out of the database and send it to the chat.
* `!rq --game PathFinder` will select a random quote from game `PathFinder` and send it to the chat.

There's no functionality beyond that.

## What's the future of RoboQuote?

This is probably it. I wrote this as a little hobby project to fill a very specific need and wanted to put it here just so I had some form of version control on it. I **strongly** recommend against using it unless you're me or you know me and I've directed you here. Even then, you would be justified in your skepticism.