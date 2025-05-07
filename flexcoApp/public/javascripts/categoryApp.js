
$(document).on('click', '#addcategory', function () {

  if (document.getElementById('categoryname').value.length < 1) {
    return Swal.fire({
      icon: 'warning',
      title: 'Minimum 1 character for category!',
      showConfirmButton: true,
    });
  }

  request = $.ajax({
    url: "/categories",
    type: "post",
    data: { "categoryName": document.getElementById('categoryname').value }
  });

  // Callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR) {
    location.reload();
  });
  
  request.fail(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status == 401) {
      window.location.replace("http://" + window.location.host + "/login");
    }
  });

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

function edit(ele) {

  inputTag = ele.closest('.categoryelement').children[2];

  if (ele.children[0].innerHTML === 'edit') {

    inputTag.removeAttribute('readonly');
    inputTag.focus();

    // remove value and re-insert value to move pointer to end
    let tempInputValue = inputTag.value;
    inputTag.value = '';
    inputTag.value = tempInputValue;

    // change icon to done
    ele.children[0].innerHTML = "done";
  }

  else if (ele.children[0].innerHTML = "done") {
    inputTag.setAttribute('readonly', '');
    inputTag.style.outline = null;
    ele.children[0].innerHTML = "edit";

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
        title: 'Minimum 1 character for category!',
        showConfirmButton: true,
      });
    }
    else 
    {
      updateCategory(ele.closest('.categoryelement').children[3].value, newName);
    }
  }
}


/**
 * update file and projectName in server
 * @param {string} id unique id
 * @param {string} newName new name
 * @param {string} type file || project
 */
 function updateCategory(id, newName) {

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });

  request = $.ajax({
    url: `/categories/${id}`,
    type: "patch",
    data: { "categoryName": newName }
  });

  request.done(function (response, textStatus, jqXHR) {
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
        window.location.replace("http://" + window.location.host + "/categories");
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
      window.location.replace("http://" + window.location.host + "/login");
    }
  });

}

function categoryDeleteYesOrNo(ele)
{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-success'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Delete Category',
    text: 'All files with chosen category will be assigned to "All" Category. Do you want to continue?',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    console.log(result);
    if(result.isConfirmed)
      deleteCategory(ele);
    if(result.isDismissed)
    {
      Swal.fire({
        icon: 'info',
        title: 'Delete category cancelled',
        showConfirmButton: false,
        timer: 1500
      })
    }
    
  });
}

/**
 * delete element
 * @param {this} ele selected element
 */
 function deleteCategory(ele){

  const categoryId = ele.closest('.categoryelement').children[3].value;
  window.aa = ele;

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: ' btn btn-danger'
    },
    buttonsStyling: false
  });

  request = $.ajax({
    url: `/categories/${categoryId}`,
    type: "delete",
  });


  request.done(function (response, textStatus, jqXHR) {
    console.log(response)
    if (jqXHR.status === 204) {
      // delete card
      ele.closest('.categoryelement').remove()
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Category deleted',
        showConfirmButton: false,
        timer: 1500
      })
    }

    // if any html code received with HTTPstatus 200
    if (jqXHR.status === 200) {
      try {
        JSON.parse(str);
      } catch (e) {
        window.location.replace("http://" + window.location.host + "/categories");
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
      window.location.replace("http://" + window.location.host + "/login");
    }
  });

}