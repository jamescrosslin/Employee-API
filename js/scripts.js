const url = `https://randomuser.me/api/?nat=us&exc=nat,gender,id,registered,login&results=12&noinfo`;

function getUsers(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => console.log(data));
}
