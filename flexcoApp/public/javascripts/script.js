geeksportal("all") 
  
    function geeksportal(c) { 
      var x, i; 
      
      x = document.getElementsByClassName("column"); 
      
      if (c == "all") c = ""; 
      
      for (i = 0; i < x.length; i++) { 
        w3RemoveClass(x[i], "show"); 
        
        if (x[i].className.indexOf(c) > -1) 
          w3AddClass(x[i], "show"); 
      } 
    } 
  
    function w3AddClass(element, name) { 
      var i, arr1, arr2; 
      arr1 = element.className.split(" "); 
      arr2 = name.split(" "); 
      
      for (i = 0; i < arr2.length; i++) { 
        if (arr1.indexOf(arr2[i]) == -1) { 
          element.className += " " + arr2[i]; 
        } 
      } 
    } 
  
    function w3RemoveClass(element, name) { 
      var i, arr1, arr2; 
      arr1 = element.className.split(" "); 
      arr2 = name.split(" "); 
      for (i = 0; i < arr2.length; i++) { 
        while (arr1.indexOf(arr2[i]) > -1) { 
          arr1.splice(arr1.indexOf(arr2[i]), 1); 
        } 
      } 
      element.className = arr1.join(" "); 
    } 
  
    // Add active class to the current 
    // button (highlight it) 
    var btnContainer = document.getElementById("filtering"); 
    var btns = document.getElementsByClassName("filter"); 
    for (var i = 0; i < btns.length; i++) { 
      btns[i].addEventListener("click", function() { 
        
        var current = 
          document.getElementsByClassName("active"); 
        
        current[0].className = 
        current[0].className.replace(" active", ""); 
        
        this.className += " active"; 
      }); 
    } 



// delete experience
function DeleteExperience(_this) {


  var projectId = getID($(_this));
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!  \
            Files associated with this experience will be deleted",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {

    // if yes clicked
    if (result.value) {


      request = $.ajax({
        url: `/projects/${projectId}`,
        type: "delete",
      });

      // Callback handler that will be called on success
      request.done(function (response, textStatus, jqXHR) {
        console.log(projectId);
        console.log(response)
        if (jqXHR.status === 204) {

          swalWithBootstrapButtons.fire(
            "Deleted!",
            "success"
          );
          // delete card
          _this.closest('.column').remove()
        }

        // if any html code received with HTTPstatus 200
        if (jqXHR.status === 200) {
          try {
            JSON.parse(str);
          } catch (e) {
            window.location.replace("https://" + window.location.host + "/login");
          }
        }
      });

      request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        swalWithBootstrapButtons.fire(
          jqXHR.responseJSON.message,
          jqXHR.responseJSON.error,
          // "error"
        );
        if (jqXHR.status == 401) {
          window.location.replace("https://" + window.location.host + "/login");
        }
      });


      // request.done(function (response, textStatus, jqXHR) {

      //   if (jqXHR.status === 200) {
      //     listExperience();
      //     storageUsed();
      //     swalWithBootstrapButtons.fire(
      //       "Deleted!",
      //       response.success,
      //       "success"
      //     )
      //   }
      // });

      // request.fail(function (jqXHR, textStatus, errorThrown) {

      //   swalWithBootstrapButtons.fire(
      //     "Warning",
      //     jqXHR.responseJSON.error,
      //     "error"
      //   )
      // });

    }

    // if cancel button pressed
    else if (result.dismiss === Swal.DismissReason.cancel) {
      message = {  text: "Your project is safe :)", title: "Cancelled" };
      swalWithBootstrapButtons.fire(
        message.title,
        message.text,
        message.status
      )
    }

  })
}
//copy file

function copyfile() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");

}





/*sidebaradjest*/
$(document).ready(function() {
  
  $('.sideMenuToggler').on('click', function() {
    $('.wrapper').toggleClass('active');
  });

});

/*-----Create Experience------------*/


function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    document.getElementById("status").innerHTML="File Load successfully";
    document.getElementById("status").style.color= "#0FA015 ";

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,'" title="',escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
          
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
// var el = document.getElementById('modelfiles');
// if(el){
//   el. addEventListener('change', handleFileSelect, false);
  
// }

// tag field//////////////////////
let input, hashtagArray, container, t;

input = document.querySelector('#hashtags');
container = document.querySelector('.tag-container');
hashtagArray = [];

document.addEventListener('keyup', () => {
    if (event.which === 13 && input.value.length > 0) {
      var text = document.createTextNode(input.value);
      var p = document.createElement('p');
      container.appendChild(p);
      p.appendChild(text);
      p.classList.add('tag');
      input.value = '';
      
      let deleteTags = document.querySelectorAll('.tag');
      
      for(let i = 0; i < deleteTags.length; i++) {
        deleteTags[i].addEventListener('click', () => {
          container.removeChild(deleteTags[i]);
        });
      }
    }
});




