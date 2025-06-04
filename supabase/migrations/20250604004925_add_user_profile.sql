create type "public"."profile" as enum ('admin', 'manager');

create type "public"."status" as enum ('in progress', 'done', 'error');

create table "public"."async_tasks" (
    "id" uuid not null default gen_random_uuid(),
    "endpoint" text not null,
    "status" status not null default 'in progress'::status,
    "payload" jsonb not null
);


alter table "public"."async_tasks" enable row level security;

create table "public"."user_api" (
    "id" uuid not null,
    "name" text not null,
    "email" email not null default NULL::text,
    "profile" profile not null default 'admin'::profile
);


CREATE UNIQUE INDEX async_tasks_pkey ON public.async_tasks USING btree (id);

CREATE UNIQUE INDEX user_api_pkey ON public.user_api USING btree (id);

alter table "public"."async_tasks" add constraint "async_tasks_pkey" PRIMARY KEY using index "async_tasks_pkey";

alter table "public"."user_api" add constraint "user_api_pkey" PRIMARY KEY using index "user_api_pkey";

alter table "public"."user_api" add constraint "user_api_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."user_api" validate constraint "user_api_id_fkey";

grant delete on table "public"."async_tasks" to "anon";

grant insert on table "public"."async_tasks" to "anon";

grant references on table "public"."async_tasks" to "anon";

grant select on table "public"."async_tasks" to "anon";

grant trigger on table "public"."async_tasks" to "anon";

grant truncate on table "public"."async_tasks" to "anon";

grant update on table "public"."async_tasks" to "anon";

grant delete on table "public"."async_tasks" to "authenticated";

grant insert on table "public"."async_tasks" to "authenticated";

grant references on table "public"."async_tasks" to "authenticated";

grant select on table "public"."async_tasks" to "authenticated";

grant trigger on table "public"."async_tasks" to "authenticated";

grant truncate on table "public"."async_tasks" to "authenticated";

grant update on table "public"."async_tasks" to "authenticated";

grant delete on table "public"."async_tasks" to "service_role";

grant insert on table "public"."async_tasks" to "service_role";

grant references on table "public"."async_tasks" to "service_role";

grant select on table "public"."async_tasks" to "service_role";

grant trigger on table "public"."async_tasks" to "service_role";

grant truncate on table "public"."async_tasks" to "service_role";

grant update on table "public"."async_tasks" to "service_role";

grant delete on table "public"."user_api" to "anon";

grant insert on table "public"."user_api" to "anon";

grant references on table "public"."user_api" to "anon";

grant select on table "public"."user_api" to "anon";

grant trigger on table "public"."user_api" to "anon";

grant truncate on table "public"."user_api" to "anon";

grant update on table "public"."user_api" to "anon";

grant delete on table "public"."user_api" to "authenticated";

grant insert on table "public"."user_api" to "authenticated";

grant references on table "public"."user_api" to "authenticated";

grant select on table "public"."user_api" to "authenticated";

grant trigger on table "public"."user_api" to "authenticated";

grant truncate on table "public"."user_api" to "authenticated";

grant update on table "public"."user_api" to "authenticated";

grant delete on table "public"."user_api" to "service_role";

grant insert on table "public"."user_api" to "service_role";

grant references on table "public"."user_api" to "service_role";

grant select on table "public"."user_api" to "service_role";

grant trigger on table "public"."user_api" to "service_role";

grant truncate on table "public"."user_api" to "service_role";

grant update on table "public"."user_api" to "service_role";


