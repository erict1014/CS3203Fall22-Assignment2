var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require('fs');


//global variable for tweet data
var tweetinfo = []

//store IDs of recently searched tweets
var recentsearches = []

//load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err,data ){
  if(err){
    req.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else{
    tweetinfo = JSON.parse(data);
  }
});
 


//Get functions
//Shows user info
app.get('/tweets', function(req, res) {
  //Sends tweet info to extract user IDs and names
  res.send({ tweetinfo: tweetinfo });
});

//Shows tweet info
app.get('/tweetinfo', function(req, res) {
  //Sends tweet info to extract tweet ID and text
  res.send({ tweetinfo: tweetinfo });
});

//Shows recently searched tweets
app.get('/searchinfo', function(req, res){
  //Sends tweet info of all recently searched tweets
  res.send({ recentsearches: recentsearches });
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function(req, res) {
  var tweetID = req.body.id;
  var tweetText = req.body.text;

  //Adds a new tweet to tweetinfo with date created, ID, and text
  tweetinfo.push({
    created_at: new Date().toString(),
    //Need to cast ID to number, otherwise will be a string
    id: Number(tweetID),
    text: tweetText,
  })

  res.send("Successfully created tweet");
});

//Posts the searched tweet
app.post('/searchinfo', function(req, res) {
  //ID of the tweet to search
  var tweetID = req.body.tweetID;

  var found = false;

  //Iterates through each tweet until finding an ID match
  tweetinfo.forEach(function(tweet, index) {
    if (!found && tweet.id === Number(tweetID)) {
      //Add found tweet to the list of searched tweets
      recentsearches.push(tweet);

      found = true;

      //Send the tweet to display
      res.send(tweet);
    }
  })

  //If tweet cannot be found
  if (found === false) {
    res.send("Tweet not found")
  }
});

//Update screen name
app.put('/tweets/:nm', function(req, res) {
  //User's name
  var name = req.params.nm;
  //New screen name for user
  var newName = req.body.newName;

  var found = false;

  //Iterates through users until finding a screen name match
  tweetinfo.forEach(function(user, index) {
    if (!found && user.user.name === name) {
      //Update the user's screen name
      user.user.screen_name = newName;

      found = true;
    }
  })

  res.send("Successfully updated screen name");
});

//Delete tweet
app.delete('/tweetinfo/:tweetid', function(req, res) {
  //ID of the tweet to delete
  var id = req.params.tweetid;

  var found = false;

  //Iterate through each tweet until finding an ID match
  tweetinfo.forEach(function(tweet, index) {
    if (!found && tweet.id === Number(id)) {
      //Delete one tweet at the index where the tweet was found
      tweetinfo.splice(index, 1);

      found = true;
    }
  })

  //Reset found for deletion from searches
  found = false;

  //Iterate through list of searched tweets to delete from it as well
  recentsearches.forEach(function(tweet, index) {
    if (!found && tweet.id === Number(id)) {
      //Delete tweet from recent searches
      recentsearches.splice(index, 1);

      found = true;
    }
  })

  res.send("Successfully deleted tweet");
});


app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});