"use strict";

const form = document.querySelector("form#addform");
// form.setAttribute("novalidate", true);

form.addEventListener("submit", evt => {
  evt.preventDefault();

  const inputData = {
    bandname: form.elements.bandname.value,
    musicgenre: form.elements.genre.value,
    nrofmembers: form.elements.nrofmembers.value,
    songtitle: form.elements.song.value
  };
  post(inputData);
});

function get() {
  fetch("https://bandsdatabase-76bc.restdb.io/rest/bands", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887ce8fd86cb75861e2623",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(bands => {
      console.log(bands);
      bands.forEach(addBandToDOM);
    });
}
get();

function addBandToDOM(band) {
  const template = document.querySelector("template").content;
  const clone = template.cloneNode(true);
  const formEdit = clone.querySelector("form#editform");
  clone.querySelector("article").dataset.bandid = band._id;
  clone.querySelector(".flip-card").dataset.bandid = band._id;
  formEdit.dataset.bandid = band._id;
  clone.querySelector("h1").textContent = band.bandname;
  clone.querySelector("h2").textContent = band.musicgenre;
  clone.querySelector("h3").textContent = band.nrofmembers;
  clone.querySelector("p").textContent = band.songtitle;

  formEdit.addEventListener("submit", evt => {
    evt.preventDefault();
    put(band._id);
  });

  clone.querySelector(".delete").addEventListener("click", () => {
    deleteBand(band._id);
  });

  clone.querySelector(".edit").addEventListener("click", () => {
    clickedDetails(band._id);
  });
  clone.querySelector(".cancel").addEventListener("click", () => {
    cancelDetails(band._id);
  });

  document.querySelector(".app").prepend(clone);
}

function clickedDetails(id) {
  const clickedBand = document.querySelector(`.flip-card[data-bandid="${id}"`);
  clickedBand.classList.add("clicked");
  editBand(id);
}

function cancelDetails(id) {
  const clickedBand = document.querySelector(`.flip-card[data-bandid="${id}"`);
  clickedBand.classList.remove("clicked");
}

function post(inputData) {
  addBandToDOM(inputData);
  const postData = JSON.stringify(inputData);
  fetch("https://bandsdatabase-76bc.restdb.io/rest/bands", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887ce8fd86cb75861e2623",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(() => {
      form.elements.bandname.value = "";
      form.elements.genre.value = "";
      form.elements.nrofmembers.value = "";
      form.elements.song.value = "";
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
    "https://bandsdatabase-76bc.restdb.io/rest/bands/" +
      formEdit.elements.id.value,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5d887ce8fd86cb75861e2623",
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

function deleteBand(id) {
  fetch("https://bandsdatabase-76bc.restdb.io/rest/bands/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887ce8fd86cb75861e2623",
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
  fetch(`https://bandsdatabase-76bc.restdb.io/rest/bands/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887ce8fd86cb75861e2623",
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
