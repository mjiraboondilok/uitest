ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE VIEW public.employee_jobs AS
  SELECT employees.job_id
  FROM employees
  WHERE ((
    employees.id IN (SELECT employee_reports_view.id FROM employee_reports_view))
  AND (
    employees.id <> (SELECT auth.uid() AS uid))
  );


CREATE POLICY "Enable users to view their employees jobs"
ON public.jobs
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ((id IN (SELECT employee_jobs.job_id FROM employee_jobs)));



