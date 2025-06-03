ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE VIEW public.employee_reports_view AS WITH RECURSIVE manager(id, manager_id) AS (
 SELECT employees.id,
    employees.manager_id
   FROM employees
  WHERE (employees.id = (SELECT auth.uid() AS uid))
UNION ALL
 SELECT e.id,
    e.manager_id
   FROM manager m,
    employees e
  WHERE (e.manager_id = m.id)
)
SELECT DISTINCT id FROM manager;

CREATE POLICY "Enable users to view their employees"
ON public.employees
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ((
  id IN (
    SELECT employee_reports_view.id
    FROM employee_reports_view
  )
));



