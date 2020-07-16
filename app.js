var newItem = true;
var itemName;
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var myUsername;
document.getElementById("page-2").style.display = "none";

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "index.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};
ui.start("#firebaseui-auth-container", uiConfig);
if (ui.isPendingRedirect()) {
  ui.start("#firebaseui-auth-container", uiConfig);
}
var mainApp = {};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("page-1").style.display = "none";
    document.getElementById("page-2").style.display = "block";
    myui.initialize();
    //hide the card for that and display other card
    myUsername = user.uid;
  } else {
    document.getElementById("page-2").style.display = "none";
    document.getElementById("page-1").style.display = "block";
    //redirect to login page
  }
});
function logOut() {
  firebase.auth().signOut();
  document.getElementById("page-2").style.display = "none";
  document.getElementById("page-1").style.display = "block";
}
mainApp.logOut = logOut;

class Task {
  constructor(id, item, priority, username) {
    this.item = item;
    this.id = id;
    this.priority = {};
    this.username = username;
  }
}

class UI {
  constructor() {
    this.tasks = [];
  }
  initialize() {
    const url = "https://ix-2020-green-laurap.firebaseio.com/tasks.json";
    fetch(url)
      .then((response) => {
        response
          .json()
          .then((data) => {
            console.log(data);
            Object.keys(data).forEach((key) => {
              if (myUsername === data[key].username) {
                console.log(data[key].username);
                console.log(data[key]);
                const list = document.getElementById("task-list");
                var priorityUI = document.getElementById("priority");
                var myPriority = priorityUI.value;

                const taskId = data[key].id;
                const taskTitle = data[key].title;
                const taskPriority = data[key].priority;
                const taskUsername = data[key].username;
                const task = new Task(
                  taskId,
                  taskTitle,
                  taskPriority,
                  taskUsername
                );
                this.tasks.push(task);

                if (taskPriority === "high") {
                  var textColor = "danger";
                } else if (taskPriority === "medium") {
                  var textColor = "warning";
                } else if (taskPriority === "low") {
                  var textColor = "success";
                }
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td id="myitem" class="text-${textColor}" mykey="${taskId}">${taskTitle}</td>
                    <td><a class="btn btn-info" href="#" role="button" id="edit">Edit</a></td>
                    <td><a class="btn btn-dark" href="#" role="button" id="delete">Delete</a></td>
                    `;
                list.appendChild(row);
              }
            });
          })
          .catch((err) => console.log("Err", err));
      })
      .catch((err) => console.log("Oops:", err));
    const db = firebase.database();
    var myPriority = firebase.database().ref().push().key;

    db.ref("/properties").set({
      high: { color: "red", shortform: "H" },
      medium: { color: "yellow", shortform: "M" },
      low: { color: "green", shortform: "L" },
    });
  }
  addTask(item, uid) {
    const userName = uid;
    const db = firebase.database();
    const list = document.getElementById("task-list");
    var priorityUI = document.getElementById("priority");
    if (newItem) {
      var newPostKey = firebase.database().ref("tasks").push().key;

      db.ref("tasks/" + newPostKey).set({
        id: newPostKey,
        title: item,
        priority: priorityUI.value,
        username: userName,
      });

      const task = new Task(newPostKey, item, priorityUI.value, userName);
      this.tasks.push(task);

      if (priorityUI.value === "high") {
        var textColor = "danger";
      } else if (priorityUI.value === "medium") {
        var textColor = "warning";
      } else if (priorityUI.value === "low") {
        var textColor = "success";
      }
      const row = document.createElement("tr");
      row.innerHTML = `
              <td id="myitem" class="text-${textColor}" mykey="${newPostKey}">${item}</td>
              <td><a class="btn btn-info" href="#" role="button" id="edit">Edit</a></td>
              <td><a class="btn btn-dark" href="#" role="button" id="delete">Delete</a></td>
              `;
      list.appendChild(row);
    } else {
      //EDIT A TASK IN LIST
      list.querySelectorAll("td#myitem").forEach((element) => {
        if (
          element.innerHTML === itemName &&
          element.parentElement.id === "editing"
        ) {
          var sameId = element.getAttribute("mykey");
          console.log(sameId);
          db.ref("tasks/" + sameId).set({
            id: sameId,
            title: item,
            priority: priorityUI.value,
            username: userName
          });
          if (priorityUI.value === "high") {
            var textColor = "danger";
          } else if (priorityUI.value === "medium") {
            var textColor = "warning";
          } else if (priorityUI.value === "low") {
            var textColor = "success";
          }
          element.parentElement.innerHTML = `
          <td id="myitem" class="text-${textColor}" mykey="${sameId}">${item}</td>
          <td><a class="btn btn-info" href="#" role="button" id="edit">Edit</a></td>
          <td><a class="btn btn-dark" href="#" role="button" id="delete">Delete</a></td>
          `;
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
      //Puts the title of task in the input box to be edited
      var newText;
      target.parentElement.parentElement.id = "editing"; //id is changed to account for identical tasks
      target.parentElement.parentElement
        .querySelectorAll("td#myitem")
        .forEach((element) => {
          document.getElementById("item").value = element.innerHTML;
          newText = element.innerHTML;
        });
      itemName = newText; //stores for use in addTask()
      newItem = false;
    } else if (target.id === "delete") {
      console.log(target.parentElement.id);
      //DELETE THE TASK
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

const myui = new UI();
document.getElementById("task-form").addEventListener("submit", function (e) {
  const item = document.getElementById("item").value;
  myui.addTask(item, myUsername);
  myui.clearFields();
  e.target.parentElement.parentElement.id = ""; //resets the id for next use;

  e.preventDefault();
  newItem = true;
});

document.getElementById("task-list").addEventListener("click", function (e) {
  myui.editTask(e.target);
  e.preventDefault();
});
