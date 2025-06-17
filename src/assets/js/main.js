jQuery(document).ready(function(){
    jQuery('#mobile_menu_icon').click(function(){
        jQuery(".header_right .top_navigation").animate({
            width: "toggle"
        });

    });
    $('.show_notification').click(function(){
      $('.admin_inner_notification_wrap').slideToggle();  
    });
    $( function() {
      $( ".datepicker" ).datepicker();
    } );

  
     $('.schedule_now_btn').click(function(){
         $('.schedule_date_time').hide(); 
     });
     $('.schedule_btn').click(function(){
      $('.schedule_date_time').show(); 
     });

   //review popup// 
   $('.review_site_box ul li').click(function(){
    $(this).toggleClass('active');
   });  

    $(document).on('click','#review_wrap',function(){
          $('.md-modal').css({"visibility": "visible"});
          $('.md-content').css({"opacity": "1", "transform": "scale(1)"});
          $('.md-overlay').css({"background": "rgba(0,0,0,0.8)", "opacity": "1", "transition": "all 0.3s","visibility": "visible" });
          $('body').addClass('popup-fixed');
    });
     /*$(document).on('click','.customer_submit_form',function(){
          $('.md-modal').css({"visibility": "hidden"});
          $('.md-content').css({"opacity": "0", "transform": "scale(0.8)"});
          $('.md-overlay').css({"background": "rgba(0,0,0,0.0)", "opacity": "0", "transition": "all 0.3s","visibility": "hidden" });
    });*/

    $(document).on('click','#closeModal',function(){
          $('.md-modal').css({"visibility": "hidden"});
          $('.md-content').css({"opacity": "0", "transform": "scale(0.8)"});
          $('.md-overlay').css({"background": "rgba(0,0,0,0.0)", "opacity": "0", "transition": "all 0.3s","visibility": "hidden" });
          $('body').removeClass('popup-fixed');
    });

      $(document).on('mouseover','.rating-star', function(e) {
        var rating = $(e.target).data('rating');
         // fill all the stars
         $('.rating-star').removeClass('fa-star-o').addClass('fa-star');
         // empty all the stars to the right of the mouse
         $('.rating-star#rating-' + rating + ' ~ .rating-star').removeClass('fa-star').addClass('fa-star-o');
       }).on('mouseleave', function (e) {
         // empty all the stars except those with class .selected
         $('.rating-star').removeClass('fa-star').addClass('fa-star-o');
       }).on('click', function(e) {
         var rating = $(e.target).data('rating');
         setRating(rating);
       }).on('keyup', function(e){
         // if spacebar is pressed while selecting a star
         if (e.keyCode === 32) {
           // set rating (same as clicking on the star)
           var rating = $(e.target).data('rating');
           setRating(rating);
         }
       });
	$(document).on('click','#closeReview',function(){ 
	 $('#reviewPopup').hide();	
	}) 
});  
function reviewPopup(){
var iframe = document.querySelector('#videoplayer');
   	var player = new Vimeo.Player(iframe);
	player.on('timeupdate', function(data){
		player.getVideoTitle().then(function(title){
			//console.log(data);
			if(data.duration == data.seconds){
				$('#reviewPopup').show();
			}
			if(data.seconds > 14 && data.seconds < 16){
				$('#reviewPopup').show();
			}
		});
	});
}
var updatePlayCallback = null;
function setPlayCallback(callback){
	updatePlayCallback = callback;
}
function updateVideoPlayStats(){
	var iframe = document.querySelector('#videoplayer');
   	var player = new Vimeo.Player(iframe);
	player.on('play', function(){
		if(updatePlayCallback){
			updatePlayCallback();
        }
	});
}
jQuery(window).resize(function(){
    var height = jQuery(window).height();
    var wrapper = jQuery('#content-wrapper > .container-fluid').height();
     if(wrapper < height){
        jQuery(".sticky-footer").addClass("Fixed-Footer");
    } else {
        jQuery(".sticky-footer").removeClass("Fixed-Footer");
    };
});


function setRating(rating) {
   $('#rating-input').val(rating);
   // fill all the stars assigning the '.selected' class
   $('.rating-star').removeClass('fa-star-o').addClass('selected');
   // empty all the stars to the right of the mouse
   $('.rating-star#rating-' + rating + ' ~ .rating-star').removeClass('selected').addClass('fa-star-o');
 }
 
function setManifest(url){
    console.log(url);
    $("#manifest_selector").attr("href",url);
}
function sharepwa(){
  if (navigator.share) {
      navigator.share({
          title: 'AutoForce',
          text: 'AutoForce Reviews!',
          url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}


var deferredPrompt;

function addpwa(){
  /*var a = addToHomescreen({
    onAdd: function () {
      alert('Welcome to AutoForce!');
    }
  });*/
   // Show the prompt

  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
}



window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});