function Todo(name, state, priority) {
    this.name = name;
    this.state = state;
    this.priority = priority || 0; // Default priority
  }
  
  var todos = JSON.parse(localStorage.getItem('todos')) || [];
  var states = ["active", "inactive", "done"];
  var tabs = ["all"].concat(states);
  var currentTab = "all";
  
  var form = document.getElementById("new-todo-form");
  var input = document.getElementById("new-todo-title");
  
  form.onsubmit = function(event) {
    event.preventDefault();
    if (input.value && input.value.length) {
      todos.push(new Todo(input.value, "active"));
      input.value = "";
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    }
  };
  
  var buttons = [
    { action: "done", icon: "ok" },
    { action: "active", icon: "plus" },
    { action: "inactive", icon: "minus" },
    { action: "remove", icon: "trash" },
    { action: "up", icon: "arrow-up" },
    { action: "down", icon: "arrow-down" }
  ];
  
  function updateBadgeCounts() {
    var allCount = todos.length;
    var activeCount = todos.filter(todo => todo.state === "active").length;
    var inactiveCount = todos.filter(todo => todo.state === "inactive").length;
    var doneCount = todos.filter(todo => todo.state === "done").length;
  
    document.querySelector('li[data-tab-name="all"] .badge').textContent = allCount;
    document.querySelector('li[data-tab-name="active"] .badge').textContent = activeCount;
    document.querySelector('li[data-tab-name="inactive"] .badge').textContent = inactiveCount;
    document.querySelector('li[data-tab-name="done"] .badge').textContent = doneCount;
  }
  
  function renderTodos() {
    var todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    todos
      .filter(function(todo) {
        return todo.state === currentTab || currentTab === "all";
      })
      .sort(function(a, b) {
        return a.priority - b.priority;
      })
      .forEach(function(todo, index) {
        var div1 = document.createElement("div");
        div1.className = "row";
  
        var div2 = document.createElement("div");
        div2.innerHTML =
          '<a class="list-group-item" href="#">' + todo.name + "</a>";
        div2.className = "col-xs-6 col-sm-9 col-md-10";
  
        var div3 = document.createElement("div");
        div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
        buttons.forEach(function(button) {
          var btn = document.createElement("button");
          btn.className = "btn btn-default btn-xs";
          btn.innerHTML =
            '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
          div3.appendChild(btn);
  
          if (button.action === todo.state) {
            btn.disabled = true;
          }
  
          if (button.action === "remove") {
            btn.title = "Remove";
            btn.onclick = function() {
              if (
                confirm(
                  "Are you sure you want to delete the item titled " + todo.name
                )
              ) {
                todos.splice(todos.indexOf(todo), 1);
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
              }
            };
          } else if (button.action === "up") {
            btn.title = "Move up";
            btn.onclick = function() {
              if (index > 0) {
                var temp = todos[index];
                todos[index] = todos[index - 1];
                todos[index - 1] = temp;
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
              }
            };
          } else if (button.action === "down") {
            btn.title = "Move down";
            btn.onclick = function() {
              if (index < todos.length - 1) {
                var temp = todos[index];
                todos[index] = todos[index + 1];
                todos[index + 1] = temp;
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
              }
            };
          } else {
            btn.title = "Mark as " + button.action;
            btn.onclick = function() {
              todo.state = button.action;
              localStorage.setItem('todos', JSON.stringify(todos));
              renderTodos();
            };
          }
        });
  
        div1.appendChild(div2);
        div1.appendChild(div3);
  
        todoList.appendChild(div1);
      });
    updateBadgeCounts();
  }
  
  renderTodos();
  
  function selectTab(element) {
    var tabName = element.attributes["data-tab-name"].value;
    currentTab = tabName;
    var todoTabs = document.getElementsByClassName("todo-tab");
    for (var i = 0; i < todoTabs.length; i++) {
      todoTabs[i].classList.remove("active");
    }
    element.classList.add("active");
    renderTodos();
  }
  