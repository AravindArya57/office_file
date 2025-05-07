
let uploadtype=0;

// //////////////////////////////////////////
// submit form
$("#content-form-submit").click(function () {
    // initialization
    let error = 0;
    // let errorStyle = {
    //     'border': '1px solid #f00'
    // };
    let textFieldIds = ['title'];
    let fileFieldIds = ['modelfiles'];
    fileFieldIds.forEach(id => {
        errorMessage = validateExperienceFile(id);
        if (errorMessage)
            error = 1;
    });
    textFieldIds.forEach(id => {
        if (!isValidText(id)) {
            error = 1;
            setError("error_field", 'fill all fields', 'red');
        }
    });

    if(uploadtype==1)
    {
        if($("#url").val()=="")
        setError("error_field", "Enter a proper URL", 'red');
    }

    if (!error)
        $("#content-form").submit();
});
function isValidText(id) {
    let element = $("#" + id);
    return Boolean(element.val().length);
}
// validate size
function validateExperienceFile(id) {
    if(uploadtype == 0)
    {
        let allowedExtensions = ['pdf', 'mp4'];
        let uploadingFile = document.getElementById(id).files;
        // check file exists
        if (uploadingFile.length <= 0) {
            setError("error_field", "select a file to upload", 'red');
            changeFileUploadText('status', 'Drag  pdf or mp4 (Max file size 50MB)');
            return ("select a file to upload");
        } else {
            resetAction();
            let textMessage = uploadingFile[0].name + " <br> File Loaded successfully";
            changeFileUploadText('status', textMessage);
            $("#status").css('color', "#0FA015 ");
        }
        // check file has valid extension
        let fileExtension = uploadingFile[0].name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            // remove file
            removeFile("modelfiles");
            // set default file upload message. prompt error
            changeFileUploadText('status', 'Drag  pdf or mp4 (Max file size 50MB)');
            setError("error_field", "File Removed. Upload valid pdf or video file", 'red');
            return ("File Removed. Upload valid pdf or video file");
        }
    
    
        let uploadingFileSize = uploadingFile[0].size / (1000 * 1000); // size in mb
        Math.abs(uploadingFileSize).toFixed(2);
        if (uploadingFileSize > 50) {
            setError("error_field", `File Removed. File is larger than 50MB`, 'red');
            return (`File Removed. File is larger than 50MB `);
        }
        return;         
    }
    else
    {

    }
    
}


$(document).ready(function () {

    if(uploadtype == 0)
    {
        $("#url").hide();
        $("#dropFile").show();           
    }
    else
    {
        $("#url").show();
        $("#dropFile").hide();  
    }

    // ajax file upload
    $('#content-form').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            target: '#targetLayer',
            beforeSubmit: function () {
            },
            uploadProgress: function (event, position, total, percentComplete) {
                // show progress percentage
                $("#progress-div").show();
                $("#progress-bar").width(percentComplete + '%');
                $("#progress-bar").html('<div id="progress-status">' + percentComplete + ' %</div>')
            },
            complete: function (dataJSON) {
                // set message to red and hide progress bar
                $("#progress-div").hide();
                $("#progress-bar").width('0%');
                let response = dataJSON.responseJSON;
                setError("error_field", response.message, "red");

                switch (dataJSON.status) {
                    case 200:
                        // reset message
                        setError("error_field", 'Success', "green");

                        // clear form field and file
                        $("#content-form").trigger('reset');
                        removeFile("modelfiles");
                        // change file select box text
                        changeFileUploadText('status', 'Drag  pdf or mp4 (Max file size 50MB)');
                        sweetAlert({ title: "File Uploaded", text: '', status: "success" });
                        break;

                    case 401:
                        sweetAlert({ title: "Logged out due to inactivity", text: '', status: "error" });
                        window.location.replace("https://" + window.location.host + "/login");
                        break;

                    case 400:
                        sweetAlert({ title: response.message, text: '', status: "error" });
                        break;

                    case 500:
                        sweetAlert({ title: "Server Error - 42.", text: 'mindwox email : contact@mindwox.com', status: "error" });
                        window.location.replace("https://" + window.location.host + "/login");
                        break;
                    default:
                        break;
                }
            }
        });
        return false;
    });
    // end ajax block
});
// //////////////////////////////////////////
// open qr modal on success
function successModal(url) {
    $("#experience_url")[0].value = url;
    $("#successModal").modal("show");
}

function setError(id, text, color) {
    if (color)
        $("#" + id).css("color", color);
    $("#" + id).html(text);
}


function removeFile(id) {
    $("#" + id).val('');
}

function sweetAlert(message) {
    Swal.fire(
        message.title,
        message.text,
        message.status
    );
}


function resetAction() {
    $("#progress-bar").width('0%');
    setError("error_field", "", "");
}



function changeFileUploadText(id, text) {
    $("#status")[0].innerHTML = "";
    $("#status").append(`<p>${text}</p>`);
    $("#status").first().css("color", "#212529");
}


$('#FileButtonClick').click(function(){
    $("#url").hide();
      
    $("#URLButtonClick").css("color","#606060");
    $("#URLButtonClick").css("background-color","#e4e4e4");

    $("#FileButtonClick").css("color","#fff");
    $("#FileButtonClick").css("background-color","#774DEE");

    $("#dropFile").show(); 
    $("#url").val(""); 
    console.log($("#url").val());
    uploadtype = 0;
});

$('#URLButtonClick').click(function(){
    $("#url").show();
    
    $("#URLButtonClick").css("color","white");
    $("#URLButtonClick").css("background-color","#774DEE");

    $("#FileButtonClick").css("color","#606060");
    $("#FileButtonClick").css("background-color","#e4e4e4");

    $("#dropFile").hide(); 
    uploadtype = 1;
});