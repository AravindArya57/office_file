// to hide google powered by tag -- google translate
// $(window).on('load',  ()=> {
//     $(".goog-logo-link").empty();
//   $('.goog-te-gadget').html($('.goog-te-gadget').children());
// });

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

