function taskSyncTestOne() {
  clearTestStore();

  var listA = Utilities.getUuid();
  var listB = Utilities.getUuid();

  var task = insertTask(listA, { title: "🌕" });

  taskSyncHelper(listA, "testTasks");

  task.title = "🌑";
  updateTask(listA, task);

  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  var taskA = getTasks(listA, 1)[0].title;
  var taskB = getTasks(listB, 1)[0].title;

  if (taskA === "🌑" && taskB === "🌑") {
    Logger.log("✅ Passed Test #1");
  } else {
    Logger.log("❌ Failed Test #1");
  }

  Logger.log("Task A: " + taskA);
  Logger.log("Task B: " + taskB);

  deleteList(listA);
  deleteList(listB);

  clearTestStore();
}

function taskSyncTestTwo() {
  clearTestStore();

  var listA = Utilities.getUuid();
  var listB = Utilities.getUuid();

  var taskOne = insertTask(listA, { title: "🌳" });
  var taskTwo = insertTask(listA, { title: "🍃" });

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  moveTask(listA, taskTwo, { parent: taskOne.id });
  Utilities.sleep(1000);
  var taskThree = getTasks(listB, 2).find((task) => task.title === "🍃");
  taskThree.title = "🍁";
  updateTask(listB, taskThree);

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");

  var taskA = getTasks(listA, 1)[0].title;
  var taskB = getTasks(listB, 1)[0].title;

  if (taskA === "🍁" && taskB === "🍁") {
    Logger.log("✅ Passed Test #2");
  } else {
    Logger.log("❌ Failed Test #2");
  }

  Logger.log("Task A: " + taskA);
  Logger.log("Task B: " + taskB);

  deleteList(listA);
  deleteList(listB);

  clearTestStore();
}

function taskSyncTestThree() {
  clearTestStore();

  var listA = Utilities.getUuid();
  var listB = Utilities.getUuid();

  var taskOne = insertTask(listA, { title: "🌳" });
  var taskTwo = insertTask(listA, { title: "🍃" });

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  moveTask(listA, taskTwo, { parent: taskOne.id });

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  moveTask(listA, taskTwo, {});

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  var taskA = getTasks(listA, 1)[0].parent;
  var taskB = getTasks(listB, 1)[0].parent;

  if (taskA === undefined && taskB === undefined) {
    Logger.log("✅ Passed Test #3");
  } else {
    Logger.log("❌ Failed Test #3");
  }

  Logger.log("Task A Parent: " + taskA);
  Logger.log("Task B Parent: " + taskB);

  deleteList(listA);
  deleteList(listB);

  clearTestStore();
}

function taskSyncTestFour() {
  clearTestStore();

  var listA = Utilities.getUuid();
  var listB = Utilities.getUuid();

  var taskOne = insertTask(listA, { title: "🐦" });

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  taskOne.title = "🐶";
  updateTask(listA, taskOne);
  Utilities.sleep(1000);
  var taskTwo = getTasks(listB, 1)[0];
  taskTwo.title = "🐱";
  updateTask(listB, taskTwo);

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listA, "testTasks");

  var taskA = getTasks(listA, 1)[0].title;
  var taskB = getTasks(listB, 1)[0].title;

  if (taskA === "🐱" && taskB === "🐱") {
    Logger.log("✅ Passed Test #4");
  } else {
    Logger.log("❌ Failed Test #4");
  }

  Logger.log("Task A: " + taskA);
  Logger.log("Task B: " + taskB);

  deleteList(listA);
  deleteList(listB);

  clearTestStore();
}

function taskSyncTestFive() {
  clearTestStore();

  var listA = Utilities.getUuid();
  var listB = Utilities.getUuid();

  var taskOne = insertTask(listA, { title: "🌳" });
  var taskTwo = insertTask(listA, { title: "🍃" });

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  moveTask(listA, taskTwo, { parent: taskOne.id });

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  moveTask(listA, taskTwo, {});

  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");

  var tasks = getTasks(listB, 2);
  var taskThree = tasks.find((task) => task.title === "🌳");
  var taskFour = tasks.find((task) => task.title === "🍃");
  moveTask(listB, taskFour, { parent: taskThree.id });

  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");
  taskSyncHelper(listB, "testTasks");
  taskSyncHelper(listA, "testTasks");

  var taskA = getTasks(listA, 1)[0].parent;
  var taskB = getTasks(listB, 1)[0].parent;

  if (typeof taskA === "string" && typeof taskB === "string") {
    Logger.log("✅ Passed Test #5");
  } else {
    Logger.log("❌ Failed Test #5");
  }

  Logger.log("Task A Parent: " + taskA);
  Logger.log("Task B Parent: " + taskB);

  deleteList(listA);
  deleteList(listB);

  clearTestStore();
}

function insertTask(listTitle, task) {
  var lists = Tasks.Tasklists.list();
  var list =
    lists.items.find((list) => list.title === listTitle) ||
    Tasks.Tasklists.insert({ title: listTitle });

  return Tasks.Tasks.insert(task, list.id);
}

function updateTask(listTitle, task) {
  var lists = Tasks.Tasklists.list();
  var list = lists.items.find((list) => list.title === listTitle);

  return Tasks.Tasks.update(task, list.id, task.id);
}

function moveTask(listTitle, task, options) {
  var lists = Tasks.Tasklists.list();
  var list = lists.items.find((list) => list.title === listTitle);

  return Tasks.Tasks.move(list.id, task.id, options);
}

function getTasks(listTitle, maxResults) {
  var lists = Tasks.Tasklists.list();
  var list = lists.items.find((list) => list.title === listTitle);
  var tasks =
    Tasks.Tasks.list(list.id, {
      showDeleted: true,
      showHidden: true,
      maxResults: maxResults,
    }).items || [];

  return tasks;
}

function deleteList(listTitle) {
  var lists = Tasks.Tasklists.list();
  var list = lists.items.find((list) => list.title === listTitle);

  Tasks.Tasklists.remove(list.id);
}

function printTestStore() {
  var store = PropertiesService.getScriptProperties();
  Logger.log(store.getProperty("testTasks"));
}

function clearTestStore() {
  PropertiesService.getScriptProperties().deleteProperty("testTasks");
}

function clearEntireStore() {
  PropertiesService.getScriptProperties().deleteAllProperties();
}
