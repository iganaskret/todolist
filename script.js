"use strict";

const form = document.querySelector("form#addform");
// form.setAttribute("novalidate", true);

form.addEventListener("submit", evt => {
  evt.preventDefault();

  const inputData = {
    task: form.elements.task.value,
    category: form.elements.genre.value,
    taskmanager: form.elements.taskmanager.value,
    todo: form.elements.todo.value,
    doing: form.elements.doing.value
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
  formEdit.dataset.bandid = task._id;
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
  addBandToDOM(inputData);
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
  const formEdit = document.querySelector(`#editform[data-bandid="${id}"`);
  const data = {
    bandname: formEdit.elements.bandname.value,
    genre: formEdit.elements.genre.value,
    nrofmembers: formEdit.elements.nrofmembers.value,
    songtitle: formEdit.elements.song.value
  };
  const postData = JSON.stringify(data);
  fetch(
    "https://todolist-ebac.restdb.io/rest/todolist/" +
      formEdit.elements.id.value,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5d8e0ae91ce70f63798550a9",
        "cache-control": "no-cache"
      },
      body: postData
    }
  )
    .then(res => res.json())
    .then(updatedBand => {
      const parentElement = document.querySelector(
        `article[data-bandid="${updatedBand._id}"`
      );
      parentElement.querySelector("h1").textContent = updatedBand.bandname;
      parentElement.querySelector("h2").textContent = updatedBand.genre;
      parentElement.querySelector("h3").textContent = updatedBand.nrofmembers;
      parentElement.querySelector("p").textContent = updatedBand.songtitle;
      formEdit.elements.bandname.value = "";
      formEdit.elements.genre.value = "";
      formEdit.elements.nrofmembers.value = "";
      formEdit.elements.song.value = "";
      formEdit.elements.id.value = "";
      cancelDetails(updatedBand._id);
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
      document.querySelector(`.flip-card[data-bandid="${id}"`).remove();
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
    .then(bands => {
      const formEdit = document.querySelector(`#editform[data-bandid="${id}"`);
      formEdit.elements.bandname.value = bands.bandname;
      formEdit.elements.genre.value = bands.musicgenre;
      formEdit.elements.nrofmembers.value = bands.nrofmembers;
      formEdit.elements.song.value = bands.songtitle;
      formEdit.elements.id.value = bands._id;
    });
}
