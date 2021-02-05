class Person {
  /**
   * @constructor
   * @param {object} data an object from the randomuser.me API
   * @description creates a
   */
  constructor(data) {
    //destructure the incoming object to assign values to class object properties
    const {
      name: { first, last },
      location: {
        street: { number: streetNum, name: streetName },
        city,
        state,
        postcode,
      },
      dob: { date },
      phone,
      email,
      picture: { large: pic },
    } = data;

    //reformat date from "YYYY-MM-DD" to "MM/DD/YYYY"
    const bDay = date.replace(/^(\d{4})-(\d{2})-(\d{2}).+$/, "$2/$3/$1");
    //reformat phone number from "(xxx)-xxx-xxxx" to "(xxx) xxx-xxxx"
    const phoneNUm = phone.replace("-", " ");

    this.element = null;
    this.card = `<div class="card show">
      <div class="card-img-container">
        <img class="card-img" src="${pic}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 class="card-name cap">${first} ${last}</h3>
        <p class="card-text">${email}</p>
        <p class="card-text cap">${city}, ${state}</p>
      </div>
    </div>`;
    this.modal = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
        <div class="modal-info-container">
          <img class="modal-img" src="${pic}" alt="profile picture">
          <h3 class="modal-name cap">${first} ${last}</h3>
          <p class="modal-text">${email}</p>
          <p class="modal-text cap">$${city}, ${state}</p>
          <hr>
          <p class="modal-text">${phoneNUm}</p>
          <p class="modal-text">${streetNum} ${streetName}<br>${city}, ${state} ${postcode}</p>
          <p class="modal-text">Birthday: ${bDay}</p>
        </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>`;
  }
}
class Gallery {
  constructor(target) {
    this.people = [];
    this.showing = document.getElementsByClassName("show");
    this.activeProfile = null;
    this.target = target;
  }
  printUsers(data) {
    data.forEach((user, i) => {
      user = new Person(user, this);
      this.people.push(user);
      this.target.insertAdjacentHTML("beforeend", user.card);
      user.element = this.target.lastElementChild;
    });
  }
  printModal(selection) {
    this.activeProfile = selection;
    console.log(selection, this.activeProfile);
    this.target.insertAdjacentHTML("beforeend", this.activeProfile.modal);
  }
  cycleModal(id) {
    const showing = [...this.showing];
    const index = showing.indexOf(this.activeProfile.element);
    let element;
    this.target.lastElementChild.remove();
    if (id === "modal-prev") {
      element = showing[index === 0 ? showing.length - 1 : index - 1];
      this.printModal(this.getPerson(element));
    }
    if (id === "modal-next") {
      element = showing[index === showing.length - 1 ? 0 : index + 1];
      this.printModal(this.getPerson(element));
    }
  }
  getPerson(card) {
    return this.people.find((person) => person.element === card);
  }
}

const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=12&noinfo`;
const gallery = new Gallery(document.getElementById("gallery"));

async function getUsers(url) {
  const res = await fetch(url);
  const { results } = await res.json();
  gallery.printUsers(results);
}
gallery.target.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    gallery.cycleModal(e.target.id);
  } else {
    const selection = e.path[e.path.indexOf(gallery.target) - 1];
    gallery.printModal(gallery.getPerson(selection));
  }
});
getUsers(url);
