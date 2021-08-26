// Needed for credentials
require('dotenv').config();

// Setup Discord client
const Discord = require('discord.js');
const client = new Discord.Client();
const util = require('util');

// Redis setup
const redis = require("redis");
const redis_client = redis.createClient(process.env.REDIS_URL);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

/* Below, I define some promise methods to handle interactions with redis. Note
that I've used the KEYS method from Redis here, which is a bad idea in
production. Normally, I'd like to think my taste in code is better than this,
but I have a kid and a job where I also write code, and I'm done fussing with
SCAN and cursors because it's all a ridiculous disaster. The present way of
doing things would be EXTREMELY slow on a large database. Caveat emptor. */
const { promisify } = require('util');
const getKey = promisify(redis_client.KEYS).bind(redis_client);
const getAsync = promisify(redis_client.get).bind(redis_client);

// Define a method that grabs a quote matching a pattern
async function printQuote (msg, pattern) {
    var res = await getKey(pattern);
    var idx = Math.floor(Math.random() * res.length);
    var quote_raw = await getAsync(res[idx]);
    var quote = JSON.parse(quote_raw);
    msg.reply(util.format('%s -- %s, while playing %s', quote.content, quote.author, quote.game));
}

// Define a method to add a quote to the database. Hope you spelled it right the first time!
async function addQuote(msg, quoteString) {
    let res = await getKey("*");
    let key_idxs = [];
    for (let i = 0; i < res.length; i++) {
        let splt = res[i].toString().split("_");
        let idx = splt[splt.length - 1];
        key_idxs.push(Number(idx));
    }
    let max_idx = Math.max.apply(Math, key_idxs);
    let new_idx = max_idx + 1;
    try {
        console.log(quoteString);
        let parsedQuote = JSON.parse(quoteString);
        let game = parsedQuote.game;
        let fullkey = util.format("%s_%s", game, new_idx);
        redis_client.set(fullkey, quoteString);
        msg.reply(util.format("Successfully logged %s at %s", quoteString, fullkey));
    } catch (e) {
        msg.reply(util.format("%s happened when I tried to parse this.", e));
        return 1;
    }
}

/* Below is a commented-out function to clear out the Redis DB.
const delQuoteAsync = promisify(redis_client.del).bind(redis_client);
async function delQuotes (msg) {
    var res = await getKey("*");
    for (let i = 0; i < res.length; i++) { 
        await delQuoteAsync(res[i]);
    }
    msg.reply("Deleted the stuff.");
}
*/

// Start the client and listen for interactions from users
client.on('message', msg => {
    if (msg.content.startsWith('!rq')) {
        if (msg.content.includes('--game')) {
            var parsed = msg.content.split('--game ');
            var game = parsed[parsed.length - 1];
            var game_pattern = game + "_*";
        } else {
            var game_pattern = "*";
        }
        printQuote(msg, game_pattern);
    } else if (msg.content.startsWith('!addquote')) {
        let parsed = msg.content.split('--quote ');
        let quoteRawString = parsed[parsed.length - 1];
        addQuote(msg, quoteRawString);
    }
})

client.login();