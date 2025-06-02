# Evaluation Instructions

## Prereqs

- Must have npm, git, supabase cli, and docker.

## Overview:

This test is designed to assess your skills using a stack that includes
Supabase, Next.JS, and React. The tasks closely mirror the responsibilities
expected for this role at CandorIQ and will heavily test your system design
abilities.

## Guidelines:

1. **Flexibility:** Feel free to leverage any available resources. Use any of
   the specified technologies, but avoid introducing new ones.

2. **Grading Focus:** The primary focus during grading will be on the
   functionality and quality of your code.

3. **Quality Check:** Before progressing to the next task, ensure a thorough
   quality check of your code. Attention to detail is crucial.

### Supabase Setup

1. Follow supabase setup instructions here =>
   [https://supabase.com/docs/guides/local-development/cli/getting-started](https://supabase.com/docs/guides/local-development/cli/getting-started)
2. To start supabase run `supabase start` in your terminal
3. To run sql migrations and seed the database run `supabase db reset`

### Phase 1

### Setup

1. Install all dependencies by running `npm install`
2. Link the NextJS application to local Supabase by creating a `.env.local` file
   in the root folder and adding the following 2 keys
   - `NEXT_PUBLIC_SUPABASE_URL="http://localhost:64321"`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY="{insert anon key}"` (You can get the anon
     key by running `supabase status`)
3. Run `npm run dev` in your terminal to start your application.
4. Go to [http://localhost:3000/](http://localhost:3000/) in your browser.
5. After completion, submit by email after compressing the folder into a zip
   file.
6. Access the supabase ui [http://localhost:64323/](http://localhost:64323/)

### Task

There are three tables: employees, jobs, and departments. Each employee has a
manager_id that references another employee's record. Currently, logging in from
any account grants visibility of all employee records. Your task is to implement
access control so that each account can view only the employees within their
management hierarchy.

For example, David Anderson should be able to see Alice Johnson, as he is her
manager, and also Jessica White, as Alice is Jessica's manager. However, David
should not be able to see John Doe, who is his own manager and he should not see
himself. Ensure that the access control works correctly for two specific
accounts, David Anderson and Emma Williams. Access shouldn’t be limited only at
UI but also at the API level as Supabase automatically creates API routes for
all tables in the public schema.

### Account Credentials:

1. David Anderson
   - email: david.anderson@example.com
   - password: password123

2. Emma Williams
   - email: emma.williams@example.com
   - password: password123

**Bonus** Each employee is associated with a specific job. Ensure that
each account can view only the jobs linked to the employees they have permission
to access, according to the management hierarchy.

### Phase 2

### Setup
1. Clone the apitest repo: [https://github.com/candoriq/apitest/](https://github.com/candoriq/apitest) 
2. Link the API to local Supabase by creating a .env file in the root folder and adding the following keys:
   - `SUPABASE_URL="http://host.docker.internal:64321"`
   - `SUPABASE_SERVICE_KEY="{insert anon key}"`
   - `APP_URL="http://localhost:8080"`
3. Add the following key to the .env.local file in the uitest repo
   - `COMASYNC_URL="http://localhost:8080"`
4. Run the API in a separate compiler window using `docker-compose up --build`

### Task

The next task is to link the project to link a task management api, and use it to create new users asynchronously.

An example call to the api has been included, starting at /app/(authenticated)/api/page.tsx. Before beginning this phase, it is highly recommended to navigate this flow. 

Also, see the docs for creating a new user: [https://supabase.com/docs/reference/javascript/auth-admin-createuser/](https://supabase.com/docs/reference/javascript/auth-admin-createuser)

We will now introduce the concept of a user profile.

**In the uitest repo,** 

Create a new table called user_api to store users and their corresponding profile.
Profile can be one of two options - admin or manager. 
This table should contain the columns:
   - id (foreign key to auth.users)
   - name (string)
   - email (email)
   - profile (enum: admin, manager)

Next, create a new table called async_tasks to help track the status of the user signup task in real time. 
This table should contain the columns: 
   - endpoint (string), 
   - status (enum: in_progress, done, or error),
   - payload (jsonb)

Seed the two given users into the user_api table. Assign the manager profile to David and the admin profile to Emma.

Add a new tab to the app’s side-panel called Users. This new Users page should have a table containing current users’ names and their corresponding profiles. 

The page should also contain a button to add new users. Clicking the button should open a modal containing a form. 

At the top of the create new users form, add a dropdown for Profile, with the options admin and manager.
Beneath, render a checklist containing all employees that do not currently have a user_api record. You will have to query the new user_api table and employees table to obtain this list. 
Finally, add a Submit button at the bottom. 

The modal must have a state variable, taskId, which we will use later to obtain the live status of the user signup task.

When the form is submitted, we want to trigger an asynchronous task to sign up all of the new users selected with the profile selected. 

Submitting the form should insert an in_progress record to the async_tasks table with the endpoint ‘/users/signup_all’ and the payload that will be passed into this endpoint.

After inserting the record, enqueue /tasks/trigger, which must accept the id of the newly created task.

After calling /tasks/trigger, we must return the id of the newly created task so the ui has access to it and can track the status of the task. Update the taskId state variable in the create users modal to store the id of the newly created task.

**In the apitest repo,**

Create the endpoints /tasks/trigger, /users/signup_all, and /users/signup_one

/tasks/trigger should query the async_tasks table with the task’s id to obtain the payload and enqueue /users/signup_all, passing in the returned payload.

/users/signup_all should enqueue /users/signup_one for each new user until there are no new users. When there are no remaining new users, update the status of the asynchronous task’s record in the async_tasks table to ‘done’. 

Note that /users/signup_one must insert a record into the user_api table alongside creating the Supabase user. 

If at any point an error occurs while signing up a user, update the status of the async_task to ‘error’ in the database and stop the task. 

**Back in the uitest repo,**

While the asynchronous task is executing, we want to listen to the async_tasks table and wait for the task to complete. 

Add this to a SQL migration:
 - alter publication supabase_realtime add table public.async_tasks;

Add this skeleton to the create new users form component to help you get started

```
useEffect(() => {
    const getTaskStatus = async () => {
      try {
       const res = await ky.get(`/api/async_tasks/${taskId}`)
        const data = await res.json<{
          id: string
          status: string
        }>()

        // if the status is already done or error, mutate the call that fetches user_api data (race condition). The get call above should fetch the status of the task
        // add code here
        const channel = createClient()
          .channel('create_users_status_changes')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'private' },
            async (payload) => {
              // If the payload's table is async_tasks and we have the correct task id, and if the status is done or error mutate the call that fetches user_api_id
              // add code here
            }
          )
          .subscribe()

        return () => {
          channel.unsubscribe()
        }
      } catch (error) {
        console.error('Error fetching task status:', error)
      }
    }

    getTaskStatus()
  }, [taskId])
```

**Bonus 1**

Now, we want to alter the access policies we outlined in the previous phase. Admin users should see all employees and jobs, regardless of the management hierarchy, while manager users should obey the rules outlined in Phase 1. 


**Bonus 2**

Instead of stopping the task on errors, we want to persist an error log while signing up each user. If the task fails, add the error to log. After all users have been processed, save the error log to the async_tasks table in a new string array column called errors while updating the status to error. 

 
**Bonus 3**

Add validation in the api to validate all payloads prior to processing. If the payload validation fails, update the asynchronous task’s status to error and add to the error log.

