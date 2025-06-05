create policy "Enable admins to view all employees"
on "public"."employees"
as permissive
for select
to authenticated
using ((( SELECT user_api.profile
   FROM user_api
  WHERE (user_api.id = auth.uid())
 LIMIT 1) = 'admin'::profile));


create policy "Enable admins to view all jobs"
on "public"."jobs"
as permissive
for select
to public
using ((( SELECT user_api.profile
   FROM user_api
  WHERE (user_api.id = auth.uid())
 LIMIT 1) = 'admin'::profile));



