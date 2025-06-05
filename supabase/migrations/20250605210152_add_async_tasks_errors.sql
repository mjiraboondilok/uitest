alter table "public"."async_tasks" add column "errors" text[];

alter table "public"."async_tasks" add column "parent_id" uuid;

alter table "public"."async_tasks" add constraint "async_tasks_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES async_tasks(id) not valid;

alter table "public"."async_tasks" validate constraint "async_tasks_parent_id_fkey";


