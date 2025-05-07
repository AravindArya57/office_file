
function changeFileCategory(ele) {
  const id = ele.closest('.card-body').children[2].value;
  let categoryvalue = ele.value;
  console.log(categoryvalue);
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });
    
  request = $.ajax({
    url: `/file/${id}`,
    type: "patch",
    data: { "category": categoryvalue}
  });
  
  request.done(function (response, textStatus, jqXHR) {
    console.log(response)
    if (jqXHR.status === 204) {

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Category Updated',
        showConfirmButton: false,
        timer: 1500
      })
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




/**
 * toggle edit and save state and \
 * associated styling for the input tag \
 * if toggled to save update in db
 * 
 * @param {this} ele selected element
 * @param {string} content file || project
 */
function edit(ele, content) {

  let inputTag = '';
  let fileId = '';
  let newName = '';
  if (content == "file") {
    inputTag = ele.closest('.card-body').children[1];
    fileId = ele.closest('.card-body').children[2].value;
    inputTag.style.outline = 'solid 1px #161515';
  }
  else if (content == "project") {
    inputTag = ele.closest('.projecttitle').children[0].firstChild;
    inputTag.style.outline = 'solid 1px white';

    projectId = window.location.pathname.split('/')[4];
  }

  if (ele.innerHTML.trim() == "edit") {

    inputTag.removeAttribute('readonly');
    inputTag.focus();

    // remove value and re-insert value to move pointer to end
    let tempInputValue = inputTag.value;
    inputTag.value = '';
    inputTag.value = tempInputValue;

    // change icon to done
    ele.innerHTML = "done";
  }
  else if (ele.innerHTML == "done") {
    inputTag.setAttribute('readonly', '');
    inputTag.style.outline = null;
    ele.innerHTML = "edit";
    newName = inputTag.value.trim();

    if (newName.length > 50) {
      return Swal.fire({
        icon: 'warning',
        title: 'No more than 50 characters!',
        showConfirmButton: true,
      });
    }
    else if (newName.length < 1) {
      return Swal.fire({
        icon: 'warning',
        title: 'Minimum 1 character for title!',
        showConfirmButton: true,
      });
    }
    else {
      switch (content) {
        case "file":
          updateName(fileId, newName, type = "file");
          break;

        case "project":
          updateName(projectId, newName, type = "project");
          break;

        default:
          break;
      }
    }
  }

}


/**
 * Get element in user set order \
 * update new order
 */

function updateViewOrder() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });

  const projectId = window.location.pathname.split('/')[4];
  let elementList = document.querySelectorAll("#fileId");
  let ids = [];
  elementList.forEach(element => {
    ids.push(element.value);
  });
  console.log(projectId);
  ids = ids.toString();
  console.log(ids);
  const request = $.ajax({
    url: `/file/order/${projectId}`,
    type: "patch",
    data: { "newOrder": ids }
  });

  request.done(function (response, textStatus, jqXHR) {
    if (jqXHR.status === 204) {

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'layout Updated',
        showConfirmButton: false,
        timer: 1500
      })
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


/**
 * update file and projectName in server
 * @param {string} id unique id
 * @param {string} newName new name
 * @param {string} type file || project
 */
function updateName(id, newName, type) {

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });

  if (type == "file") {

    request = $.ajax({
      url: `/file/${id}`,
      type: "patch",
      data: { "fileName": newName }
    });
  }
  else if (type == "project") {

    request = $.ajax({
      url: `/projects/${id}`,
      type: "patch",
      data: { "projectName": newName }
    });

  }
  request.done(function (response, textStatus, jqXHR) {
    console.log(response)
    if (jqXHR.status === 204) {

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Name Updated',
        showConfirmButton: false,
        timer: 1500
      })
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


/**
 * delete element
 * @param {this} ele selected element
 */
 function deleteFile(ele) {


  const fileId = ele.closest('.card-body').children[2].value;
  window.aa = ele;
  

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });

  request = $.ajax({
    url: `/file/${fileId}`,
    type: "delete",
  });


  request.done(function (response, textStatus, jqXHR) {
    console.log(response)
    if (jqXHR.status === 204) {
      // delete card
      ele.closest('.carddesign').remove()
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'File deleted',
        showConfirmButton: false,
        timer: 1500
      })
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





