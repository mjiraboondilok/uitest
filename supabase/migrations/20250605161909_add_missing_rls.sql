alter table "public"."departments" enable row level security;

alter table "public"."user_api" enable row level security;

create policy "Enable insert for authenticated users only"
on "public"."async_tasks"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."async_tasks"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."departments"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."user_api"
as permissive
for select
to public
using (true);



