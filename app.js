var newItem = true;
var itemName;

class Task {
  constructor(id, item) {
    this.item = item;
    this.id = id;
  }
}

class UI {
  constructor() {
    this.tasks = [];
    const url = "https://ix-2020-green-laurap.firebaseio.com/tasks.json";
    fetch(url)
      .then((response) => {
        response
          .json()
          .then((data) => {
            console.log(data);

            Object.keys(data).forEach((key) => {
              console.log(key);
              console.log(data[key]);

              const taskId = data[key].id;
              const taskTitle = data[key].title;
              const task = new Task(taskId, taskTitle);
              this.tasks.push(task);

              const list = document.getElementById("task-list");

              const row = document.createElement("tr");
              row.innerHTML = `
                    <td id="myitem" mykey=${taskId}>${taskTitle}</td>
                    <td><a class="btn btn-info" href="#" role="button" id="edit">Edit</a></td>
                    <td><a class="btn btn-dark" href="#" role="button" id="delete">Delete</a></td>
                    `;
              list.appendChild(row);
            });
          })
          .catch((err) => console.log("Err", err));
      })
      .catch((err) => console.log("Oops:", err));
  }

  addTask(item) {
    const db = firebase.database();
    const list = document.getElementById("task-list");
    if (newItem) {
      var newPostKey = firebase.database().ref("tasks").push().key;
      db.ref("tasks/" + newPostKey).set({
        id: newPostKey,
        title: item,
      });
      const row = document.createElement("tr");
      row.innerHTML = `
            <td id="myitem" mykey=${newPostKey}>${item}</td>
            <td><a class="btn btn-info" href="#" role="button" id="edit">Edit</a></td>
            <td><a class="btn btn-dark" href="#" role="button" id="delete">Delete</a></td>
            `;
      list.appendChild(row);
    } else {
      list.querySelectorAll("td#myitem").forEach((element) => {
        if (
          element.innerHTML === itemName &&
          element.parentElement.id === "editing"
        ) {
          element.innerHTML = item;
          var sameId = element.getAttribute("mykey");
          db.ref("tasks/" + sameId).set({
            id: sameId,
            title: item,
          });
        }
      });
    }
  }

  clearFields() {
    document.getElementById("item").value = "";
  }

  editTask(target) {
    const db = firebase.database();
    if (target.id === "edit") {
      var newText;
      target.parentElement.parentElement.id = "editing"; //id is changed to account for identical tasks
      target.parentElement.parentElement
        .querySelectorAll("td#myitem")
        .forEach((element) => {
          newText = element.innerHTML;
        });
      document.getElementById("item").value = newText;
      itemName = newText; //stores the item being examined
      newItem = false;
    } else if (target.id === "delete") {
      target.parentElement.parentElement
        .querySelectorAll("td#myitem")
        .forEach((element) => {
          var sameId = element.getAttribute("mykey");
          db.ref("tasks/" + sameId).remove();
        });
      target.parentElement.parentElement.remove();
      newItem = false;
    }
  }
}
const ui = new UI();

document.getElementById("task-form").addEventListener("submit", function (e) {
  const item = document.getElementById("item").value;

  ui.addTask(item);
  ui.clearFields();
  e.target.parentElement.parentElement.id = ""; //resets the id for next use;

  e.preventDefault();
  newItem = true;
});

document.getElementById("task-list").addEventListener("click", function (e) {
  ui.editTask(e.target);
  e.preventDefault();
});
