const toDo = document.getElementById("to-do-tasks");
let deleteAlert = document.getElementById("delete-alert");
let showPgNum = document.getElementById("showPgNum");
const titleInp = document.getElementById("title-input");
const taskInformation = document.getElementById("task-information");
let taskNumPerPage = 10;
let garbage;
let apiDataArray;
let totalPages;
window.onload = () => {
  todoUrlCheck();
};

function getDataX() {
  return fetch("https://61868473cd8530001765ab11.mockapi.io/todos", {
    method: "GET",
  });
}

async function todoUrlCheck() {
  const urlSearch = window.location.search;
  const urlParams = new URLSearchParams(urlSearch);
  if (urlParams.has("page")) {
    let pageNum = window.location.search.replace("?", "").split("=")[1];
    let apiResponseData = await getDataX();
    let apiDataArray = await apiResponseData.json();
    let totalDataLength = apiDataArray.length;
    totalPages = Math.ceil(totalDataLength / taskNumPerPage);
    if (pageNum > totalPages) {
      window.location.assign(`${window.location.origin}` + "/404.html");
    } else {
      let pageNum = window.location.search.replace("?", "").split("=")[1];
      taskPerPageX(pageNum);
    }
  } else {
    taskPerPageX(1);
  }
}

function paginationPage(totalPages) {
  let ul = document.getElementsByClassName("pagination")[0];
  ul.innerHTML = "";
  let pagHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="prevPg()">
      <span aria-hidden="true">&laquo;</span>
      <span class="sr-only">Previous</span>
  </a>
</li>

<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="nextPg()">
      <span aria-hidden="true">&raquo;</span>
      <span class="sr-only">Next</span>
  </a>
</li>`;
  ul.innerHTML = pagHTML;
  let pageNum = window.location.search.replace("?", "").split("=")[1];
  for (i = 1; i <= totalPages; i++) {
    let li = document.createElement("li");
    if (pageNum == i) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
    li.classList.add("page-item");
    let a = document.createElement("a");
    a.classList.add("page-link");
    a.setAttribute("href", "#");
    a.setAttribute("id", `${i}`);
    a.setAttribute("onclick", "taskPerPage(event)");
    a.innerText = i;
    li.append(a);
    let paginationNav = document.getElementById("pagination-nav");
    ul.insertBefore(li, ul.lastElementChild);
    paginationNav.append(ul);
  }
}

async function taskPerPage(e) {
  window.history.replaceState(null, null, `${window.location.origin}` + `${window.location.pathname}` + `?page=${e.target.id}`);
  const urlSearch = window.location.search;
  let pageNum = urlSearch.replace("?", "").split("=")[1];
  taskPerPageX(pageNum);
}

async function taskPerPageX(pgNum) {
  window.history.replaceState(null, null, `${window.location.origin}` + `${window.location.pathname}` + `?page=${pgNum}`);
  showPgNum.innerHTML = `<i>Page ${pgNum} </i>`;
  showPgNum.setAttribute("id", `${pgNum}`);
  let apiResponseData = await getDataX();
  let apiDataArray = await apiResponseData.json();
  let totalDataLength = apiDataArray.length;
  totalPages = Math.ceil(totalDataLength / taskNumPerPage);
  paginationPage(totalPages);

  let keys = ["title", "description", "dueDate", "checked", "id"];
  let taskObj;
  if (totalDataLength == 0) {
    taskObj = [];
  } else {
    taskObj = apiDataArray;
  }
  let newTaskObj = [];
  let html = ``;
  let result = [];
  let start = pgNum * taskNumPerPage - taskNumPerPage;
  let end;
  let isLastPg = taskObj.length / taskNumPerPage - pgNum;
  if (isLastPg > 0) {
    end = pgNum * taskNumPerPage - 1;
    newTaskObj = [];
    for (let i = start; i <= end; i++) {
      newTaskObj.push(taskObj[i]);
    }
  } else if (isLastPg <= 0) {
    end = taskObj.length;
    for (let i = start; i < end; i++) {
      newTaskObj.push(taskObj[i]);
    }
  }
  newTaskObj.forEach((item) => {
    for (let key in item) {
      for (let i = 0; i < keys.length; i++) {
        if (key == keys[i]) {
          result.push(item[key]);
        }
      }
    }
    html += `<div
      class="task-box w-100 h-auto mb-3 d-flex flex-column border border-2 border-info justify-content-between" data-taskId="${result[4]}">
      <div class="task-title w-100 d-flex align-items-center justify-content-between">
          <div class="task-heading d-flex align-items-center justify-content-center m-2">
              <input id="checkbox" class="checkbox form-check-input form-check d-inline align-self-center"
                  type="checkbox"  ${item.checked ? "checked" : ""} onclick="saveCheckbox(event)">
              <span id="task" class="task ms-4 fs-4" id="task">${result[0]}</span>
              <span class="date text-dark opacity-75 ms-3">${result[3]}</span>
          </div>
          <div class="icons m-2">
              <i class="fas fa-pencil-alt fa-2x text-primary" role="button" onclick="editText(event)"></i>
              <i class="fas fa-trash-alt fa-2x ms-4 text-danger" role="button"
                  onclick="showAlert(event)"></i>
          </div>
      </div>
      <div class="task-desc m-2">
          <p class="m-1 text-start"> ${result[1]} </p>
      </div>
  </div>`;

    toDo.innerHTML = html;
    result = [];
  });
}

function prevPg() {
  let showPgNumId = +showPgNum.id;
  if (showPgNumId - 1 > 0) {
    taskPerPageX(showPgNumId - 1);
  }
}

function nextPg() {
  let showPgNumId = +showPgNum.id;
  if (totalPages - showPgNumId > 0) {
    taskPerPageX(showPgNumId + 1);
  }
}

function showAlert(e) {
  e.preventDefault();
  garbage = e.target;
  let title = garbage.parentElement.previousElementSibling.children[1].innerHTML;
  let description = garbage.parentElement.parentElement.nextElementSibling.children[0].innerHTML;
  let date = garbage.parentElement.previousElementSibling.children[2].innerHTML;
  let html = `<div class="del-task-heading d-flex align-items-center">
  <span id="del-task" class="task fs-5" id="task">${title}</span>
  <span class="del-date text-dark ms-3 opacity-75 ms-3">${date}</span>
</div>
<div class="del-task-desc">
  <p class=" text-start">${description}</p>
</div>`;
  taskInformation.innerHTML = html;
  deleteAlert.classList.remove("d-none");
}

function deleteTask(e) {
  e.preventDefault();
  showPgNum.id;
  let taskBox = garbage.parentElement.parentElement.parentElement;
  var taskId = taskBox.getAttribute("data-taskId");
  fetch("https://61868473cd8530001765ab11.mockapi.io/todos" + `/${taskId}`, {
    method: "DELETE",
  }).then(() => {
    deleteAlert.classList.add("d-none");
    taskBox.remove();
    taskPerPageX(showPgNum.id);
  });
}

function removeDeleteAlert() {
  deleteAlert.classList.add("d-none");
}

function editText(e) {
  e.preventDefault();
  let editPen = e.target;
  let taskBox = editPen.parentElement.parentElement.parentElement;
  let taskId = taskBox.getAttribute("data-taskId");
  window.location.assign(
    `${window.location.origin}` + "/HOME.html" + `?id=${taskId}`
  );
}

function saveCheckbox(e) {
  let checkBox = e.target;
  let taskBox = checkBox.parentElement.parentElement.parentElement;
  let taskId = taskBox.getAttribute("data-taskId");
  fetch("https://61868473cd8530001765ab11.mockapi.io/todos" + `/${taskId}`, {
    method: "GET",
  })
    .then((data) => data.json())
    .then((json) => {
      json.checked = !json.checked;
      fetch(
        "https://61868473cd8530001765ab11.mockapi.io/todos" + `/${taskId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            checked: json.checked,
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
    });
}
