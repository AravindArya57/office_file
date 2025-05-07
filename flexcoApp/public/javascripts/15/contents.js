// to hide google powered by tag -- google translate
// $(window).on('load',  ()=> {
//     $(".goog-logo-link").empty();
//   $('.goog-te-gadget').html($('.goog-te-gadget').children());
// });
function SubForm (){
  $.ajax({
      url:'https://script.google.com/macros/s/AKfycbzWtfcsw_RHQaL5l30igFOxrG-2-wwsD0UuJA-8hhzjvRSbKeca2HabuJyuQwYa62DK8Q/exec',
      type:'post',
      data:$("#Form").serializeArray(),
      success: function(){
        $("#Form").hide();
        $("#Files").show();
        alert("Data Submitted :)")
      },
      error: function(){
        alert("There was an error :(")
      }
  });
}


/* stop playing the youtube video when I close the modal */
$('#youtubevideoModal').on('hide.bs.modal',  (e)=> {
  $('#youtube').attr('src','')
}) 

/* stop local videos */
$('#videoModal').on('hide.bs.modal',  (e)=> {
  let videoPlayer =document.getElementById('video')
  videoPlayer.pause();
}) 

/* when modal link clicked */
function changeUrl(url){
  let currentUrl = document.getElementById('video').src;
  if(currentUrl !== url)
    document.getElementById('video').src = url;
  
  if(url.includes('youtube.com'))
    $('#youtube').attr('src', url)
}

/* translate */
// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false}, 'google_translate_element');
//   }


$('select[name="category"]').change(function() {
  var $this = $(this);
  var categoryofcards = document.getElementsByName('CategoryDisplay');
  var cards = document.getElementsByName('Card');
  for(let i=0;i<categoryofcards.length;i++)
  {
    if($this.val()=='All')
      cards[i].style.display = "block";
    else
    { 
      if($this.val()==categoryofcards[i].innerHTML)
        cards[i].style.display = "block"; 
      else
        cards[i].style.display = "none"; 
    }
 }

});