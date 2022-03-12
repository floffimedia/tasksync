# taskSync

Share Google Tasks lists with other users

## How to install

This script needs to run inside a new Google Apps Script project. All data and permissions are tied to that project. Data is never shared with anyone except Google and the group of users of that specific, newly created project. Use at your own risk and only if you understand the consequences.

1. [Create a new Google Apps Script project](https://script.google.com/home/projects/create)

2. Copy the contents of [Code.gs](https://github.com/floffimedia/tasksync/blob/main/Code.gs) into the editor, replacing the existing content

3. On the first line, replace _My Shared Tasks_ with the name of the Google Tasks list you want to turn into a shared list and save

4. In the menu on the left-hand side, click on the plus symbol next to _Services_, highlight _Tasks API_ and add

5. Open the share menu by clicking on the ![Share this project with others](https://user-images.githubusercontent.com/13572603/157766047-e456071b-6ea6-489f-af9e-a643c3fca399.svg) button

6. For each user you want to have access to your list, enter their email address. Change the permission from _Editor_ to _Viewer_

7. Go to the triggers tab by clicking on the ![Trigger](https://user-images.githubusercontent.com/13572603/157771794-17bb41a8-f5d4-4e4a-9ef2-209f2643c8f2.svg) button

8. Click on _Add Trigger_

9. Select the following options

   - Choose which function to run: _taskSync_

   - Choose which deployment should run: _Head_

   - Select event source: _Time-driven_

   - Select type of time based trigger: _Minutes timer_

   - Select minute interval: _Every 5 minutes_

   - Failure notification settings: _Notify me weekly_

10. Save and in the pop up, select your account, click on _Advanced_ and then _Go to_ [Your Project Name] _(unsafe)_

11. If you feel confident in giving this script access to your Google Tasks account, click _Allow_

12. Tell each of your collaborators to perform steps 7 to 11 on their end. You can point them to the right menu by copying the URL from the address bar of your browser

13. All done! Everyone who granted access to their account should now see the shared list anywhere they can access Google Tasks

## Additional information

[Read the announcement on my blog](https://floffi.media/en/web/google-tasks-how-to-share-task-lists-with-other-users/)

## Known issues

- If task’s due date is set, only the _date_ part is synchronised, not the time of day. Google [doesn't expose](https://developers.google.com/tasks/reference/rest/v1/tasks#Task.FIELDS.due) this information through the API

- For the same reason, repeating tasks are not synchronised correctly. Only the initial due date is set

- Merge conflicts are resolved by choosing the most recent version. See the example below

  | User A                  | User B                  |
  | :---------------------- | :---------------------- |
  | `00:01` 🍎              | `00:01` 🍎              |
  | `00:02` Replace(🍎, 🍐) | `00:03` Replace(🍎, 🍊) |
  | `00:04` 🍐              | `00:04` 🍊              |
  | `00:05` taskSync()      | `00:06` taskSync()      |
  | `00:07` 🍐              | `00:07` 🍊              |
  | `00:08` taskSync()      | `00:09` taskSync()      |
  | `00:10` 🍊              | `00:10` 🍊              |

## Tests

The tests in [Tests.gs](https://github.com/floffimedia/tasksync/blob/main/Tests.gs) can be performed from a single user account. Synchronisation is simulated by creating temporary lists which are deleted once no longer needed.
