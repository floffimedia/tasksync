var sharedListTitle = "My Shared Tasks";

function taskSync() {
  taskSyncHelper(sharedListTitle, "serverTasks");
}

function taskSyncHelper(sharedListTitle, storeName) {
  var store = PropertiesService.getScriptProperties();
  var serverTasks = JSON.parse(store.getProperty(storeName)) || {};

  var clientLists = Tasks.Tasklists.list();
  var clientList =
    clientLists.items.find((list) => list.title === sharedListTitle) ||
    Tasks.Tasklists.insert({ title: sharedListTitle });
  var clientTasks =
    Tasks.Tasks.list(clientList.id, {
      showDeleted: true,
      showHidden: true,
      maxResults: 100,
    }).items || [];

  function serverTasksGet(id) {
    return Object.values(serverTasks).find((task) =>
      Object.values(task.meta).find((entry) => entry.id === id)
    );
  }

  function serverTasksSet(task, uuid, meta) {
    task.uuid = uuid;
    task.meta = meta;
    task.meta[clientList.id] = {
      id: task.id,
      synced: task.updated,
      version: task.updated,
    };
    serverTasks[uuid] = task;
  }

  function serverTasksSetMeta(oldTask, newTask) {
    serverTasks[oldTask.uuid].meta[clientList.id] = {
      id: newTask.id,
      synced: newTask.updated,
      version: oldTask.updated,
    };
  }

  function serverTasksSorted() {
    var parents = [];
    var children = [];
    var chronological = Object.values(serverTasks).sort(
      (a, b) => Date.parse(a.updated) - Date.parse(b.updated)
    );

    // Process parents first so they can be referenced by children
    chronological.forEach((task) =>
      task.parent ? children.push(task) : parents.push(task)
    );

    return parents.concat(children);
  }

  // Client to server
  for (clientTask of clientTasks) {
    // Check if task already exists on server side
    var serverTask = serverTasksGet(clientTask.id);

    if (
      serverTask &&
      serverTask.meta[clientList.id].synced < clientTask.updated &&
      serverTask.updated < clientTask.updated
    ) {
      Logger.log("Pulling in content update: " + clientTask.title);
      serverTasksSet(clientTask, serverTask.uuid, serverTask.meta);
    } else if (
      serverTask &&
      typeof serverTask.parent !== typeof clientTask.parent &&
      clientTask.status === "needsAction" &&
      clientTask.deleted !== true &&
      serverTask.meta[clientList.id].version === serverTask.updated
    ) {
      Logger.log("Pulling in indentation update: " + clientTask.title);
      clientTask.updated = new Date(
        Date.parse(serverTask.updated) + 1
      ).toISOString();
      serverTasksSet(clientTask, serverTask.uuid, serverTask.meta);
    } else if (!serverTask) {
      Logger.log("Pulling in new task: " + clientTask.title);
      serverTasksSet(clientTask, Utilities.getUuid(), {});
    }
  }

  Logger.log(
    "Tasks stored on server (including deleted): " + serverTasksSorted().length
  );

  // Server to client
  for (serverTask of serverTasksSorted()) {
    var newTask = undefined;
    var parentTask = undefined;
    var parentTaskId = {};

    // Check if parent exists on server side
    if (serverTask.parent) parentTask = serverTasksGet(serverTask.parent);

    // Check if parent exists on client side
    if (parentTask && parentTask.meta[clientList.id])
      parentTaskId = { parent: parentTask.meta[clientList.id].id };

    // Check if task already exists on client side
    var clientTask = serverTask.meta[clientList.id];

    if (clientTask && clientTask.version < serverTask.updated) {
      Logger.log("Pushing out update: " + serverTask.title);

      serverTask.id = clientTask.id; // Required for API call
      newTask = Tasks.Tasks.update(serverTask, clientList.id, clientTask.id);

      if (serverTask.status === "needsAction" && serverTask.deleted !== true)
        newTask = Tasks.Tasks.move(clientList.id, newTask.id, parentTaskId);

      Tasks.Tasklists.update(clientList, clientList.id); // Required to refresh UI
      serverTasksSetMeta(serverTask, newTask);
    } else if (!clientTask) {
      Logger.log("Pushing out new task: " + serverTask.title);
      newTask = Tasks.Tasks.insert(serverTask, clientList.id, parentTaskId);
      serverTasksSetMeta(serverTask, newTask);
    }
  }

  store.setProperty(storeName, JSON.stringify(serverTasks));
}
