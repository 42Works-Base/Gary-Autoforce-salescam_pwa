var twilio_username;
var twilio_identity;
var twilio_channel_id;
var twilio_channel_name;

var chatStatusCallback = null;

var scrollToBottom = true;


function initTwilioChat(username, identity, channelId, channelName, statusCallback){
  
  twilio_username = username;

  twilio_identity = identity;

  twilio_channel_id = channelId;

  twilio_channel_name = channelName;

  chatStatusCallback = statusCallback;
  
}

$(document).ready(function(){
  
})

var twiliochat = (function() {
  var tc = {};
  var authors = {};
  var chat_users = {};
  //var apiUrl = 'https://staging-api.autoforce.reviews/public/api/';
  var pageURL = $(location).attr("href");
  var GENERAL_CHANNEL_UNIQUE_NAME;
  var GENERAL_CHANNEL_NAME;
  var MESSAGES_HISTORY_LIMIT = 50;
  var $channelList;
  var $inputText;
  var $usernameInput;
  var $statusRow;
  var $connectPanel;
  var $newChannelInputRow;
  var $newChannelInput;
  var $typingRow;
  var $typingPlaceholder;
  var loading_messages = false;
  var messagesAnchor;

  $(document).ready(function() {
  	/*$(document).on( "click", "#initChat", function(){

        twiliochat.initChat(twilio_username, twilio_identity, twilio_channel_id, twilio_channel_name);

        $(".app-loading").show();
  	  
  	})
  	$(document).on( "click", "#closeChat", function(){
  	  $('.twilio-chat-section').hide();
  	})	*/
    tc.$messageList = $('#message-list');
    $channelList = $('#channel-list');
    $inputText = $('#input-text');
    $usernameInput = $('#username-input');
    $statusRow = $('#status-row');
    $connectPanel = $('#connect-panel');
    $newChannelInputRow = $('#new-channel-input-row');
    $newChannelInput = $('#new-channel-input');
    $typingRow = $('#typing-row');
    $typingPlaceholder = $('#typing-placeholder');
    $usernameInput.focus();
    $usernameInput.on('keypress', handleUsernameInputKeypress);
    $inputText.on('keypress', handleInputTextKeypress);
    $newChannelInput.on('keypress', tc.handleNewChannelInputKeypress);
    $(document).on("click", "#connect-image", connectClientWithUsername);
    //$(document).on("click", "#add-channel-imag", showAddChannelInput);
    $(document).on("click", "#leave-span", disconnectClient);
    //$(document).on("click", "#delete-channel-span", deleteCurrentChannel);

    $(document).on("click","#send-chat", function(){
      sendMessageToTwilio();
    });
    $("#message-list").scroll(loadPreviousMessages);
  });
  tc.initChat = function(username, identity, channel_Id, channel_name){

    GENERAL_CHANNEL_NAME = channel_name;

    GENERAL_CHANNEL_UNIQUE_NAME = channel_Id;

    connectClient(username, identity);

    //$('.twilio-chat-section').show();

    
  }
  function connectClient(username, identity) {
    
    tc.username = username;

    fetchAccessToken(identity, connectMessagingClient);
  }

  function handleUsernameInputKeypress(event) {
    if (event.keyCode === 13){
      connectClientWithUsername();
    }
  }
  function sendMessageToTwilio(){
    tc.currentChannel.sendMessage($("#input-text").val());
    $("#input-text").val('');
  }
  function handleInputTextKeypress(event) {
    if (event.keyCode === 13) {
      tc.currentChannel.sendMessage($(this).val());
      event.preventDefault();
      $(this).val('');
    }
    else {
      notifyTyping();
    }
  }

  var notifyTyping = $.throttle(function() {
    tc.currentChannel.typing();
  }, 1000);

  tc.handleNewChannelInputKeypress = function(event) {
    if (event.keyCode === 13) {
      tc.messagingClient.createChannel({
        friendlyName: $newChannelInput.val()
      }).then(hideAddChannelInput);
      $(this).val('');
      event.preventDefault();
    }
  };

  function connectClientWithUsername() {
    var usernameText = $usernameInput.val();
    $usernameInput.val('');
    if (usernameText == '') {
      alert('Username cannot be empty');
      return;
    }
    tc.username = usernameText;
    fetchAccessToken(tc.username, connectMessagingClient);
  }
  
  function fetchAccessToken(username, handler) {	  
    $.post(apiUrl+'servicecam/generate_token', {identity: username}, null, 'json')
      .done(function(response) {
        handler(response.token);
      })
      .fail(function(error) {
        console.log('Failed to fetch the Access Token with error: ' + error);
      });
	  /*$.ajax({
		  type: "POST",
		  url: apiUrl+"servicecam/generate_token",
		  // headers: { 'X-custom-header': '7890abcdefghijkl' },
		  data: {
			identity: username
		  },
		  success: function( response ) {
			 handler(response.token);
		  }
		});*/
  }

  function connectMessagingClient(token) {
    // Initialize the Chat messaging client
    tc.accessManager = new Twilio.AccessManager(token);
    Twilio.Chat.Client.create(token).then(function(client) {
      tc.messagingClient = client;
      updateConnectedUI();
      //getSubscribedUsers();
      tc.loadChannelList(tc.joinGeneralChannel);
      tc.messagingClient.on('channelAdded', $.throttle(tc.loadChannelList));
      tc.messagingClient.on('channelRemoved', $.throttle(tc.loadChannelList));
      tc.messagingClient.on('tokenExpired', refreshToken);
      fetchFirebaseWebToken();
      $(".app-loading").hide();
    });
  }

  function refreshToken() {
    fetchAccessToken(tc.username, setNewToken);
  }

  function setNewToken(tokenResponse) {
    tc.accessManager.updateToken(tokenResponse.token);
  }

  function updateConnectedUI() {
    $('#username-span').text(tc.username);
    $statusRow.addClass('connected').removeClass('disconnected');
    tc.$messageList.addClass('connected').removeClass('disconnected');
    $connectPanel.addClass('connected').removeClass('disconnected');
    $inputText.addClass('with-shadow');
    $typingRow.addClass('connected').removeClass('disconnected');
  }

  tc.loadChannelList = function(handler) {
    if (tc.messagingClient === undefined) {
      console.log('Client is not initialized');
      return;
    }
    $(".app-loading").show();

    //getPublicChannelDescriptors

    tc.messagingClient.getSubscribedChannels().then(function(channels) {
      loadChannels(channels,handler);
    });
  };
  function getSubscribedUsers(){
    
    tc.channelArray.forEach(function(channel){
      channel.getMembers().then(function(members){

        getTwilioUser(members,0);

       

      })
    });
    
  }
  function getTwilioUser(members, index){

    if(index==members.length){
      chatStatusCallback(chat_users);
    } else {
      var index2 = index;
      tc.messagingClient.getUser(members[index].state.identity).then(function(user){
        if(user.state.identity.indexOf("customer")==-1){
          chat_users[user.state.identity] = user.state.online;

          

          user.on("updated", function(response){
            chat_users[response.user.state.identity] = response.user.state.online;

            chatStatusCallback(chat_users);
          })
        }
        
         var index = index2 + 1;
        getTwilioUser(members,index);
      }); 
      
    }
  }
  function loadChannels(channels,handler){

    if(typeof tc.channelArray == "undefined"){
      tc.channelArray = new Array();

      tc.channelArray= channels.items;
    }else {
      $(".app-loading").hide();
      tc.channelArray = tc.channelArray.concat(channels.items);
    }
    if(!channels.hasNextPage){
      afterChannelsLoaded(handler);
    } else{
      channels.nextPage().then(function(channels){
        loadChannels(channels,handler);
      })
    }
  }
  function afterChannelsLoaded(handler){
    tc.channelArray = tc.sortChannelsByName(tc.channelArray);
    $channelList.text('');
    tc.channelArray.forEach(addChannel);
    if (typeof handler === 'function') {
      handler();

      //getSubscribedUsers();

      $(".app-loading").hide();
    }
  }

  tc.joinGeneralChannel = function() {
    console.log('Attempting to join "general" chat channel...');
    if (!tc.generalChannel) {
      // If it doesn't exist, let's create it

      tc.messagingClient.getChannelByUniqueName(GENERAL_CHANNEL_UNIQUE_NAME+"").then(function(channel) {
        console.log('Created general channel');

        tc.generalChannel = channel;
        tc.loadChannelList(tc.joinGeneralChannel);

        $('.twilio-chat-section').show();

      }, function(error){
        alert("You are not allowed to Chat as RO seems to be processed.");
      });
      
      /*tc.messagingClient.createChannel({
        uniqueName: GENERAL_CHANNEL_UNIQUE_NAME,
        friendlyName: GENERAL_CHANNEL_NAME
      }).then(function(channel) {
        console.log('Created general channel');
        tc.generalChannel = channel;
        tc.loadChannelList(tc.joinGeneralChannel);
      });*/
    }
    else {
      console.log('Found general channel:');

      setupChannel(tc.generalChannel);
      $('.twilio-chat-section').show();
    }
  };

  function initChannel(channel) {
   // console.log('Initialized channel ' + channel.friendlyName);
    return tc.messagingClient.getChannelBySid(channel.sid);
  }

  function joinChannel(_channel) {

    if(_channel.channelState.status!="joined"){


    return _channel.join()
      .then(function(joinedChannel) {
        //console.log('Joined channel ' + joinedChannel.friendlyName);
        updateChannelUI(_channel);
        tc.currentChannel = _channel;
        tc.loadMessages();
        return joinedChannel;
      });
    } else {
      updateChannelUI(_channel);
        tc.currentChannel = _channel;
        tc.loadMessages();
        return _channel;
    }
  }

  function initChannelEvents() {
    //console.log(tc.currentChannel.friendlyName + ' ready.');
    tc.currentChannel.on('messageAdded', tc.addMessageToListBottom);
    tc.currentChannel.on('typingStarted', showTypingStarted);
    tc.currentChannel.on('typingEnded', hideTypingStarted);
    tc.currentChannel.on('memberJoined', notifyMemberJoined);
    tc.currentChannel.on('memberLeft', notifyMemberLeft);
    $inputText.prop('disabled', false).focus();

    $("#send-chat").prop('disabled', false);
  }

  function setupChannel(channel) {
    return leaveCurrentChannel()
      .then(function() {
        return initChannel(channel);
      })
      .then(function(_channel) {
        return joinChannel(_channel);
      })
      .then(initChannelEvents);
  }

  tc.loadMessages = function() {
    tc.currentChannel.getMessages(MESSAGES_HISTORY_LIMIT).then(function (messages) {
      //messages.items.forEach(tc.addMessageToList);

      messagesAnchor = messages;

      var temp_messages = messages.items.reverse(messages.items);
       
      loadAuthors(temp_messages, 0);

      //loadAuthors(messages, 0);
    });
  };
  function loadPreviousMessages(){
    if($("#message-list").scrollTop()==0 && !loading_messages){
      
      scrollToBottom = false;

      loading_messages = true;
      if(messagesAnchor.hasPrevPage){

        messagesAnchor.prevPage().then(function(messages){
          
          messagesAnchor = messages;

          var temp_messages = messages.items.reverse(messages.items);
       
          loadAuthors(temp_messages, 0);   
        });
      } else {

      }
    }
  }
  function loadAuthors(messages, index){

    if(index == messages.length){

      

      messages.forEach(tc.addMessageToList);

      loading_messages = false;

    } else {
      if(typeof(authors[messages[index].author])!="undefined"){
        loadAuthors(messages, index+1);  
      } else {
        

        tc.messagingClient.getUser(messages[index].author).then(function(user){
          loadAuthors(messages, index+1);
        });
       
      }
    }
  }
  function leaveCurrentChannel() {
    if (tc.currentChannel) {
      return tc.currentChannel.leave().then(function(leftChannel) {
       // console.log('left ' + leftChannel.friendlyName);
        leftChannel.removeListener('messageAdded', tc.addMessageToListBottom);
        leftChannel.removeListener('typingStarted', showTypingStarted);
        leftChannel.removeListener('typingEnded', hideTypingStarted);
        leftChannel.removeListener('memberJoined', notifyMemberJoined);
        leftChannel.removeListener('memberLeft', notifyMemberLeft);
      });
    } else {
      return Promise.resolve();
    }
  }

  tc.addMessageToList = function(message) {
    //console.log(message);
    
    if(typeof(authors[message.author])!="undefined"){
      updateMessageWindow(message);
    } else {
      

      tc.messagingClient.getUser(message.author).then(function(user){
        authors[message.author] = user.friendlyName;
        updateMessageWindow(message);
      });
     /* Twilio.Chat.User.fetch(message.author).then(function(user){
        authors[message.author] = user.friendlyName;
      })*/
    }

    
  };
  function updateMessageWindow(message){
    var rowDiv = $('<div>').addClass('row no-margin');

    rowDiv.html("<div class='row no-margin message-info-row'><div class='col-md-8 left-align'><p class='message-username'>"+authors[message.author]+"</p></div><div class='col-md-4 right-align'><span class='message-date'>"+dateFormatter.getTodayDate(message.dateCreated)+"</span></div></div><div class='row no-margin message-content-row'><div class='col-md-12'><p class='message-body'>"+message.body+"</p></div></div>");
    if (message.author === twilio_identity) {
      rowDiv.addClass('own-message');
    }

    tc.$messageList.prepend(rowDiv);

    if(scrollToBottom){
      scrollToMessageListBottom();
    }
  }

  tc.addMessageToListBottom = function(message) {
    //console.log(message);
    
    if(typeof(authors[message.author])!="undefined"){
      updateMessageWindowBottom(message);
    } else {
      

      tc.messagingClient.getUser(message.author).then(function(user){
        authors[message.author] = user.friendlyName;
        updateMessageWindowBottom(message);
      });
     /* Twilio.Chat.User.fetch(message.author).then(function(user){
        authors[message.author] = user.friendlyName;
      })*/
    }

    
  };
  function updateMessageWindowBottom(message){
    var rowDiv = $('<div>').addClass('row no-margin');

    rowDiv.html("<div class='row no-margin message-info-row'><div class='col-md-8 left-align'><p class='message-username'>"+authors[message.author]+"</p></div><div class='col-md-4 right-align'><span class='message-date'>"+dateFormatter.getTodayDate(message.dateCreated)+"</span></div></div><div class='row no-margin message-content-row'><div class='col-md-12'><p class='message-body'>"+message.body+"</p></div></div>");
    if (message.author === twilio_identity) {
      rowDiv.addClass('own-message');
    }

    tc.$messageList.append(rowDiv);
    scrollToMessageListBottom();
  }

  function notifyMemberJoined(member) {
    notify(member.identity + ' joined the channel')
  }

  function notifyMemberLeft(member) {
    notify(member.identity + ' left the channel');
  }

  function notify(message) {
    var row = $('<div>').addClass('col-md-12');
    /*row.loadTemplate('#member-notification-template', {
      status: message
    });*/
	row.html("<p class='member-status' data-content='status'>"+message+"</p>");

   // tc.$messageList.append(row);
    //scrollToMessageListBottom();
  }

  function showTypingStarted(member) {
    //$typingPlaceholder.text(member.identity + ' is typing...');
  }

  function hideTypingStarted(member) {
    //$typingPlaceholder.text('');
  }

  function scrollToMessageListBottom() {
    tc.$messageList.scrollTop(tc.$messageList[0].scrollHeight);
  }

  function updateChannelUI(selectedChannel) {
    var channelElements = $('.channel-element').toArray();
    var channelElement = channelElements.filter(function(element) {
      return $(element).data().sid === selectedChannel.sid;
    });
    channelElement = $(channelElement);
    if (tc.currentChannelContainer === undefined && selectedChannel.uniqueName === GENERAL_CHANNEL_UNIQUE_NAME) {
      tc.currentChannelContainer = channelElement;
    }
    //tc.currentChannelContainer.removeClass('selected-channel').addClass('unselected-channel');
    //channelElement.removeClass('unselected-channel').addClass('selected-channel');
    tc.currentChannelContainer = channelElement;
  }

  function showAddChannelInput() {
    if (tc.messagingClient) {
      $newChannelInputRow.addClass('showing').removeClass('not-showing');
      $channelList.addClass('showing').removeClass('not-showing');
      $newChannelInput.focus();
    }
  }

  function hideAddChannelInput() {
    $newChannelInputRow.addClass('not-showing').removeClass('showing');
    $channelList.addClass('not-showing').removeClass('showing');
    $newChannelInput.val('');
  }

  function addChannel(channel) {
    if (channel.uniqueName === GENERAL_CHANNEL_UNIQUE_NAME) {
      tc.generalChannel = channel;
    }	
    /*rowDiv.loadTemplate('#channel-template', {
      channelName: channel.friendlyName
    });*/
   /* var rowDiv = $('<div>').addClass('row channel-row');
	//console.log(channel.friendlyName);
	rowDiv.html("<div class='col-md-12'><p class='channel-element' data-content='channelName'>"+channel.friendlyName+"</p></div>");

    var channelP = rowDiv.children().children().first();
    rowDiv.on('click', selectChannel);
    channelP.data('sid', channel.sid);
    if (tc.currentChannel && channel.sid === tc.currentChannel.sid) {
      tc.currentChannelContainer = channelP;
      channelP.addClass('selected-channel');
    }
    else {
      channelP.addClass('unselected-channel')
    }
    $channelList.append(rowDiv);*/
  }

  function deleteCurrentChannel() {
    if (!tc.currentChannel) {
      return;
    }
    if (tc.currentChannel.sid === tc.generalChannel.sid) {
      alert('You cannot delete the general channel');
      return;
    }
    tc.currentChannel.delete().then(function(channel) {
      console.log('channel: '+ channel.friendlyName + ' deleted');
      setupChannel(tc.generalChannel);
    });
  }

  function selectChannel(event) {
    var target = $(event.target);
    var channelSid = target.data().sid;
    var selectedChannel = tc.channelArray.filter(function(channel) {
      return channel.sid === channelSid;
    })[0];
    if (selectedChannel === tc.currentChannel) {
      return;
    }
    if(selectedChannel.status!="joined"){
    setupChannel(selectedChannel);
  }
  };

  function disconnectClient() {
    leaveCurrentChannel();
    $channelList.text('');
    tc.$messageList.text('');
    channels = undefined;
    $statusRow.addClass('disconnected').removeClass('connected');
    tc.$messageList.addClass('disconnected').removeClass('connected');
    $connectPanel.addClass('disconnected').removeClass('connected');
    $inputText.removeClass('with-shadow');
    $typingRow.addClass('disconnected').removeClass('connected');
  }

  tc.sortChannelsByName = function(channels) {
    return channels.sort(function(a, b) {
      if(a.friendlyName==null || b.friendlyName==null){
        return -1;
      }
      if (a.friendlyName === GENERAL_CHANNEL_NAME) {
        return -1;
      }
      if (b.friendlyName === GENERAL_CHANNEL_NAME) {
        return 1;
      }
      return a.friendlyName.localeCompare(b.friendlyName);
    });
  };

  return tc;
})();