// to hide google powered by tag -- google translate
// $(window).on('load',  ()=> {
//     $(".goog-logo-link").empty();
//   $('.goog-te-gadget').html($('.goog-te-gadget').children());
// });
window.onload = function()
{ 
  // If QR3 Form not required
  if(document.getElementById('ProjectName').innerHTML.trim() != "Mining - ETEL transformers" && document.getElementById('ProjectName').innerHTML.trim() != "Kiosk - ETEL transformers")
  {
    var Form = document.getElementById('Formdata');
    Form.addEventListener('submit', function(event)
    {
      event.preventDefault();
      var name = document.getElementById("name").value;
      var company = document.getElementById("company").value;
      var position = document.getElementById("position").value;
      var mobile = document.getElementById("mobile").value;
      var email = document.getElementById("email").value;

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://mindwox.com/etel/formdata.php");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log(xhr.responseText);
          if(xhr.responseText.trim() == 'Success')
            window.location.href = "https://www.eteltransformers.com.au/";
        }};
      
      let data = '{\"name\":\"'+ name +'\",'+'\"company\":\"'+company+'\",'+'\"position\":\"'+position+'\",'+'\"mobile\":\"'+mobile+'\",'+'\"email\":\"'+email+'\"}';     
      console
      xhr.send(data);
    });
  }
  else
  {
    var Form = document.getElementById('Formdata');
    var TopNavbar = document.getElementById('TopNavbar');
    var Files = document.getElementById('Files');
    Form.style.display = "none";
    TopNavbar.style.display = "block";
    Files.style.display = "block";
  }

  var Category = document.getElementById('category');
  Category.addEventListener('change', function(event){
  var categoryofcards = document.getElementsByName('CategoryDisplay');
  var cards = document.getElementsByName('Card');
  for(let i=0;i<categoryofcards.length;i++)
  {
    if(Category.val()=='All')
      cards[i].style.display = "block";
    else
    { 
      if($this.val()==categoryofcards[i].innerHTML)
        cards[i].style.display = "block"; 
      else
        cards[i].style.display = "none"; 
    }
  }
  })
}

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

/* when modal link clicked */
function changeUrl(url){
  let currentUrl = document.getElementById('video').src;
  if(currentUrl !== url)
    document.getElementById('video').src = url;
  
  if(url.includes('youtube.com'))
    $('#youtube').attr('src', url)
}


