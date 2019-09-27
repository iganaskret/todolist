"use strict";

const form = document.querySelector("form#addform");
// form.setAttribute("novalidate", true);

form.addEventListener("submit", evt => {
  evt.preventDefault();

  const inputData = {
    task: form.elements.task.value,
    category: form.elements.category.value,
    taskmanager: form.elements.taskmanager.value
  };
  post(inputData);
});

function get() {
  fetch("https://todolist-ebac.restdb.io/rest/todolist", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(tasks => {
      console.log(tasks);
      tasks.forEach(addTaskToDOM);
    });
}
get();

function addTaskToDOM(task) {
  const template = document.querySelector("template").content;
  const clone = template.cloneNode(true);
  const formEdit = clone.querySelector("form#editform");
  clone.querySelector("article").dataset.taskid = task._id;
  clone.querySelector(".flip-card").dataset.taskid = task._id;
  formEdit.dataset.taskid = task._id;
  clone.querySelector("h1").textContent = task.task;
  clone.querySelector("h2").textContent = task.category;
  clone.querySelector("h3").textContent = task.taskmanager;

  formEdit.addEventListener("submit", evt => {
    evt.preventDefault();
    put(task._id);
  });

  clone.querySelector(".delete").addEventListener("click", () => {
    deleteTask(task._id);
  });

  clone.querySelector(".edit").addEventListener("click", () => {
    clickedDetails(task._id);
  });
  clone.querySelector(".cancel").addEventListener("click", () => {
    cancelDetails(task._id);
  });

  clone.querySelector("button.doing").addEventListener("click", () => {
    putDoing(task._id);
  });

  document.querySelector(".app").prepend(clone);
}

function clickedDetails(id) {
  const clickedTask = document.querySelector(`.flip-card[data-taskid="${id}"`);
  clickedTask.classList.add("clicked");
  editBand(id);
}

function cancelDetails(id) {
  const clickedTask = document.querySelector(`.flip-card[data-taskid="${id}"`);
  clickedTask.classList.remove("clicked");
}

function post(inputData) {
  addTaskToDOM(inputData);
  const postData = JSON.stringify(inputData);
  fetch("https://todolist-ebac.restdb.io/rest/todolist", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(() => {
      form.elements.task.value = "";
      form.elements.category.value = "";
      form.elements.taskmanager.value = "";
    });
}

function put(id) {
  const formEdit = document.querySelector(`#editform[data-taskid="${id}"`);
  const data = {
    task: formEdit.elements.task.value,
    category: formEdit.elements.category.value,
    taskmanager: formEdit.elements.taskmanager.value
  };
  const postData = JSON.stringify(data);
  fetch("https://todolist-ebac.restdb.io/rest/todolist/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(updatedTask => {
      console.log(updatedTask);
      const parentElement = document.querySelector(
        `article[data-taskid="${updatedTask._id}"`
      );
      parentElement.querySelector("h1").textContent = updatedTask.task;
      parentElement.querySelector("h2").textContent = updatedTask.category;
      parentElement.querySelector("h3").textContent = updatedTask.taskmanager;
      formEdit.elements.task.value = "";
      formEdit.elements.category.value = "";
      formEdit.elements.taskmanager.value = "";
      formEdit.elements.id.value = "";
      cancelDetails(updatedTask._id);
    });
}

function putDoing(id) {
  const parentTask = document.querySelector(`article[data-taskid="${id}"`);
  const data = {
    task: parentTask.querySelector("h1").textContent,
    category: parentTask.querySelector("h2").textContent,
    taskmanager: parentTask.querySelector("h3").textContent,
    doing: true
  };
  const postData = JSON.stringify(data);
  fetch("https://todolist-ebac.restdb.io/rest/todolist/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(updatedTask => {
      console.log(updatedTask);
      const parentElement = document.querySelector(
        `article[data-taskid="${updatedTask._id}"`
      );
      parentElement.classList.add("doing");
    });
}

function deleteTask(id) {
  fetch("https://todolist-ebac.restdb.io/rest/todolist/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      //delete from DOM
      document.querySelector(`.flip-card[data-taskid="${id}"`).remove();
    });
}

function editBand(id) {
  fetch(`https://todolist-ebac.restdb.io/rest/todolist/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(tasks => {
      const formEdit = document.querySelector(`#editform[data-taskid="${id}"`);
      console.log(formEdit);
      formEdit.elements.task.value = tasks.task;
      formEdit.elements.category.value = tasks.category;
      formEdit.elements.taskmanager.value = tasks.taskmanager;
      formEdit.elements.id.value = tasks._id;
    });
}
