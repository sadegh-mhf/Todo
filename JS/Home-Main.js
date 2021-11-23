const addBtn = document.getElementById("add-btn");
const titleInp = document.getElementById("title-input");
const descriptionInp = document.getElementById("description-input");
const dateInp = document.getElementById("date-input");
const edtTitleInp = document.getElementById("edit-title-input");
const edtDescInp = document.getElementById("edit-desc-input");
const edtDateInp = document.getElementById("edit-date-input");
const titleAlert = document.getElementById("title-alert");
const dateAlert = document.getElementById("date-alert");
const submitToast = document.getElementById("submit-toast");
const editToast = document.getElementById("edit-toast");
const form = document.forms.myForm;
const editForm = document.forms.myeditForm;
let apiDataArray;
let id;
window.onload = (event) => {
  urlCheck(event);
};

function urlCheck(e) {
  let exist;
  let idTitle;
  let idDescription;
  let idDate;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  id = window.location.search.replace("?", "").split("=")[1];
  if (urlParams.has("id")) {
    e.preventDefault();
    fetch("https://61868473cd8530001765ab11.mockapi.io/todos", {
      method: "GET",
    })
      .then((data) => (apiData = data.json()))
      .then((apiData) => {
        apiDataArray = apiData;
        exist = false;
        apiDataArray.forEach((item) => {
          if (item.id == id) {
            objToEdit = item;
            idTitle = item.title;
            idDescription = item.description;
            idDate = item.dueDate;
            editForm.classList.remove("d-none");
            form.classList.add("d-none");
            edtTitleInp.value = idTitle;
            edtDescInp.value = idDescription;
            edtDateInp.value = idDate;
            exist = true;
          }
        });
        if (exist == false) {
          window.location.assign(`${window.location.origin}` + "/404.html");
        }
      });
  }
}

form.addEventListener("submit", isEmpty);

function isEmpty(e) {
  let titleFlag;
  let dateFlag;
  e.preventDefault();

  if (titleInp.value == "") {
    titleInp.classList.remove("mb-4");
    titleInp.classList.add("invalid");
    titleAlert.style.display = "block";
    titleFlag = false;
  }
  if (dateInp.value == "") {
    dateInp.classList.remove("mb-4");
    dateInp.classList.add("invalid");
    dateAlert.style.display = "block";
    dateFlag = false;
  }
  if (titleInp.value != "") {
    titleAlert.style.display = "none";
    titleInp.classList.add("mb-4");
    titleInp.classList.remove("invalid");
    titleFlag = true;
  }
  if (dateInp.value != "") {
    dateAlert.style.display = "none";
    dateInp.classList.add("mt-4");
    dateInp.classList.remove("invalid");
    dateFlag = true;
  }

  if (titleFlag == true && dateFlag == true) {
    sendData(e);
  }
}

function sendData(e) {
  let titleVal = titleInp.value;
  let descripVal = descriptionInp.value;
  let dateVal = dateInp.value;

  let today = new Date();
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let createdTime = date + "T" + time;
  let updatedTime = date + "T" + time;
  let boxchecked = false;

  fetch("https://61868473cd8530001765ab11.mockapi.io/todos", {
    method: "POST",
    body: JSON.stringify({
      checked: boxchecked,
      createdAt: createdTime,
      description: descripVal,
      dueDate: dateVal,
      title: titleVal,
      updatedAt: updatedTime,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then(() => {
    let myToast = new bootstrap.Toast(submitToast);
    myToast.show();
    form.reset();
  });
}

function saveEditedTask(e) {
  e.preventDefault();
  let today = new Date();
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let edtUpdatedTime = date + "T" + time;

  fetch("https://61868473cd8530001765ab11.mockapi.io/todos" + `/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      description: edtDescInp.value,
      dueDate: edtDateInp.value,
      title: edtTitleInp.value,
      updatedAt: edtUpdatedTime,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then(() => {
    window.history.replaceState(null, null, `${window.location.origin}` + "/HOME.html");
    let myToast = new bootstrap.Toast(editToast);
    myToast.show();
    editForm.reset();
    editForm.classList.add("d-none");
    form.classList.remove("d-none");
  });
}
