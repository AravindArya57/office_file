var nameadded = "";
$(document).on('click', '.share', function () {

  var experienceID = getID($(this));
  var experienceURL = window.location.host + "/projects/" + experienceID;
  $("#myInput").val("https://"+experienceURL);
  var experienceName = getName($(this));
  // update qr code inside modal
  document.getElementById("qrCodeImage").innerHTML = "";
  new QRCode(
    document.getElementById("qrCodeImage"),
    {
      text: "https://"+experienceURL,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
      
    });    
    setTimeout(function () {
      if(nameadded!=experienceName)
      {
        const canvas = document.getElementById('TitleCanvas').getContext("2d");
        canvas.clearRect(0, 0, 300, 300);
        canvas.font = '12px Verdana';
        canvas.fillStyle = "black";
        nameadded = experienceName;
        if(experienceName.length>=20)
          experienceName = experienceName.substring(0,19);
        else
        {
          for(let i=0;i<(20-experienceName.length)/1.5;i++)
          {
            experienceName="  "+experienceName;
          }
        }
        canvas.fillText(experienceName,90,15);
        var canvas2 = document.getElementById("TitleCanvas");
        var QrCanvas =  document.getElementById("qrCodeImage").children[0];
        var Combine = canvas2.getContext('2d');
        Combine.drawImage(QrCanvas,90,20);
        var dataURL = canvas2.toDataURL("image/png");
        document.getElementById("downloadButton").href = dataURL.replace("image/png", "image/octet-stream");
        document.getElementById("downloadButton").download = nameadded+ ".png";
        document.getElementById("downloadButtonWithoutName").href = document.getElementById("qrCodeImage").children[1].src;
        document.getElementById("downloadButtonWithoutName").download = nameadded+ ".png";
      }
    }, 250)
    
});




function getID(clicedButton) {
  var element = clicedButton.closest('.expID');
  var text = element.children();
  var experienceID = text.eq(0).val();
  if (experienceID) {
    return experienceID
  }
  return 0;
}

function getName(clicedButton) {
  var element = clicedButton.closest('.expID');
  var expCard = element.closest('.expCard');
  var text = expCard.children();
  var experienceName = text.eq(0).text();
  if (experienceName) {
    return experienceName
  }
  return 0;
}





function CreateExperienceName() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });


  // return swalWithBootstrapButtons.fire(
  //   "25/25 projects Created. \n Wish to buy more?",
  //   "email: sales@madrasmindworks.com",
  //   "question"
  // );

  swalWithBootstrapButtons.fire({
    title: 'Project Name',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Create',
    cancelButtonText: 'Cancel',
    // reverseButtons: true
  }).then((result) => {

    // if yes clicked
    if (result.value.length > 50) {
      return swalWithBootstrapButtons.fire({

        icon: 'warning',
        title: 'No more than 50 characters!',
      }
      )
    }

    else if (result.value) {

      request = $.ajax({
        url: "/projects/",
        type: "post",
        data: { "projectName": result.value }
      });

      // Callback handler that will be called on success
      request.done(function (response, textStatus, jqXHR) {
        console.log(response)
        if (jqXHR.status === 201) {

          let card =

            `
              <div class="column Marker-based check show">
              <div class="content fit">
                <!-- Card-->
                <div class="card promoting-card">
                  <div class="card-body d-flex flex-row">
                    <h4 class="card-title font-weight mb-2">${response.projectName}</h4>
                  </div>
                  <div class="view overlay"><img src="images/folder.png" width="100%"></div>
                  <div class="card-body expID">
                    <input type="hidden" value="${response.projectId}">
                    <div class="collapse-content">
                      <a class="float-left add" href="/file/create?name=apple" type="button"><i class="material-icons icon addfiles">add</i>Add Files</a>
                      <div class="btn-group right">
                        <a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="material-icons icon">more_vert</i></a>
                        <div class="dropdown-menu">
                          <!-- <a class="dropdown-item"  onclick="EditExperience(this)" data-toggle="modal" data-target="#exampleModalEditor" >Edit</a>-->
                          <a class="share dropdown-item" data-toggle="modal" data-target="#exampleModalCenter"><i class="material-icons icon operations">share</i>Share</a>
                          <a class="dropdown-item" onclick=window.location.href='/projects/edit/${response.projectId}'><i class="material-icons icon operations">edit</i>Edit</a>
                          <!-- <a class="dropdown-item" onclick="DeleteExperience(this)"><i class="material-icons icon operations">delete</i>Delete</a> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Card-->
            </div> 
          `;    
          document.getElementById("experience-slot").insertAdjacentHTML('afterbegin', card);
          swalWithBootstrapButtons.fire(
            "Created!",
            "success"
          )
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

    }

    // if cancel button pressed
    // else if (result.dismiss === Swal.DismissReason.cancel) {
    //   message = { status: "error", text: "Your experience is safe :)", title: "Cancelled" };
    //   swalWithBootstrapButtons.fire(
    //     message.title,
    //     message.text,
    //     message.status
    //   )
    // }

  })
}