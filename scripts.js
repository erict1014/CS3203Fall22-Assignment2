
$(function() {
   //Get users
   $('#get-button').on('click', function() {
        $.ajax({
          url: 'tweets',
          contentType: 'application/json',
          success: function(response) {
            //tbody tags of the "Users" section
            var tbodyName = $('#namebody');

            //Clears tbody section
            tbodyName.html('');

            //Iterate through each object in tweetinfo
            response.tweetinfo.forEach(function(tweetInfo) {
              /*Append rows to tbody with user info 
              from each tweetInfo object*/
              tbodyName.append('\
                <tr>\
                  <td class="id">' + tweetInfo.id + '</td>\
                  <td><input type="text" class="screen_name" value="' 
                  + tweetInfo.user.screen_name + '"></td>\
                  <td><input type="text" class="name" value="' 
                  + tweetInfo.user.name + '"></td>\
                </tr>\
              ')
            })
          }
        })
    });


    //Get tweets
    $('#get-tweets-button').on('click', function(){
        $.ajax({
          url: 'tweetinfo',
          contentType: 'application/json',
          success: function(response) {
            //tbody tags of the "Tweets" section
            var tbodyTweet = $('#tweetbody'); 

            //Clears tbody section
            tbodyTweet.html('');

            //Iterate through each object in tweetinfo
            response.tweetinfo.forEach(function(tweetInfo) {
              /*Append rows to tbody with tweet info 
              from each tweetInfo object*/
              tbodyTweet.append('\
                <tr>\
                  <td class="id">' + tweetInfo.id +'</td>\
                  <td><input type="text" class="text" value="' 
                  + tweetInfo.text + '"></td>\
                  <td><input type="text" class="created_at" value="' 
                  + tweetInfo.created_at + '"></td>\
                </tr>\
              ')
            })
          }
        })
    });

    //Get recently searched tweets
    $('#get-searched-tweets').on('click', function() {
        $.ajax({
          url: 'searchinfo',
          contentType: 'application/json',
          success: function(response) {
            //tbody tags for the "Search for a Tweet" section
            var tbodySearch = $('#searchbody'); 

            //Clears tbody section
            tbodySearch.html('');

            //Iterate through each object in recentsearches
            response.recentsearches.forEach(function(recentSearch) {
              /*Append rows to tbody with tweet info 
              from each recentSearch object*/
              tbodySearch.append('\
                <tr>\
                  <td class="id">' + recentSearch.id +'</td>\
                  <td><input type="text" class="text" value="' 
                  + recentSearch.text + '"></td>\
                  <td><input type="text" class="created_at" value="' 
                  + recentSearch.created_at + '"></td>\
                </tr>\
              ')
            })
          }
        })
    });


  //Create new tweet
  $('#create-form').on('submit', function(event){
        event.preventDefault();

        //Get input field and its value
        var createInput = $('#create-input');
        var inputString = createInput.val();

        //Split the input string via semicolon seperator
        const parsedStrings = inputString.split(';');

        var id = parsedStrings[0];
        var text = parsedStrings[1];

        $.ajax({
          url: 'tweetinfo',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ id: id,
          text: text }),
          success: function(response) {
            //Clear input field
            createInput.val('');

            //Refresh current list
            $('#get-tweets-button').trigger('click');
          }
        })
  });

  //Post searched tweet
  $('#search-form').on('submit', function(event){
    event.preventDefault();
    var searchInput = $('#search-input');
    
    //ID of the tweet to search
    var tweetID = searchInput.val();

    $.ajax({
      url: 'searchinfo',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ tweetID: tweetID }),
      success: function(response) {
        //Clear input field
        searchInput.val('');

        //tbody tags for the "Search for a Tweet" section
        var tbodySearch = $('#searchbody'); 

        //Clears tbody section
        tbodySearch.html('');

        //Display the tweet with the given ID if tweet is found
        if (response != "Tweet not found"){
          tbodySearch.append('\
            <tr>\
              <td class="id">' + response.id +'</td>\
              <td><input type="text" class="text" value="' 
              + response.text + '"></td>\
              <td><input type="text" class="created_at" value="' 
              + response.created_at + '"></td>\
            </tr>\
          ')
        }
        
      }
    })
  });

  //Update screen name
  $("#update-user").on('submit', function(event){
      event.preventDefault();
    var updateInput = $('#update-input');
    var inputString = updateInput.val();

    const parsedStrings = inputString.split(';');

    //User's name
    var name = parsedStrings[0];
    //New screen name for user
    var newName = parsedStrings[1];
    
    //Updates screen name of user, given current screen name
    $.ajax({
      url: 'tweets/' + name,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ newName: newName }),
      success: function(response) {
        //Clear input field
        updateInput.val('');

        //Refresh current list
        $('#get-button').trigger('click');
      }
    })
  });


  //Delete tweet
  $("#delete-form").on('submit', function(event) {
    var id = $('#delete-input')
    event.preventDefault();

    //Value of the ID of the tweet to delete
    var idVal = id.val();

    $.ajax({
      url: 'tweetinfo/' + idVal,
      method: 'DELETE',
      contentType: 'application/json',
      success: function(response) {
        //Clear input field
        id.val('');

        //Refresh current list
        $('#get-tweets-button').trigger('click');
      }
    })
  });


});


                    
   