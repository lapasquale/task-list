var newItem = true;
var itemName;

class Task {
  constructor(item) {
    this.item = item;
  }
}

class UI {
  addTask(task) {
    const list = document.getElementById("task-list");
    if (newItem) {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td id="myitem">${task.item}</td>
            <td><a class="btn btn-info" href="#" role="button" id="edit" name="${task.item}">Edit</a></td>
            `;

      list.appendChild(row);
    } //editing a pre-existing task
    else {
      list.querySelectorAll("td#myitem").forEach((element) => {
        if (
          element.innerHTML === itemName &&
          element.parentElement.id === "editing"
        ) {
          element.innerHTML = task.item;
        }
      });
    }
  }

  clearFields() {
    document.getElementById("item").value = "";
  }

  editTask(target) {
    if (target.id === "edit") {
      document.getElementById("item").value = target.name;
      itemName = target.name; //stores the item being examined
      newItem = false;
      target.parentElement.parentElement.id = "editing"; //id is changed to account for identical tasks
    }
  }
}

document.getElementById("task-form").addEventListener("submit", function (e) {
  const item = document.getElementById("item").value;
  const task = new Task(item);

  const ui = new UI();
  ui.addTask(task);
  ui.clearFields();
  e.target.parentElement.parentElement.id = ""; //resets the id for next use;
  e.preventDefault();
  newItem = true;
});

document.getElementById("task-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.editTask(e.target);
  e.preventDefault();
});
