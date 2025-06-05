import {createClient} from "@/utils/server";
import {Database} from "@/types/supabase";

type AsyncTask = Database['public']['Tables']['async_tasks']['Row']

export async function GET(
  request: Request,
  {params}: { params: Promise<{ task: string }> }
) {
  const supabase = createClient()
  const taskId = (await params).task
  const {data, error} = await supabase.from("async_tasks")
    .select()
    .eq('id', taskId)
    .returns<AsyncTask[]>()
  if (error) {
    throw error
  }
  return Response.json({id: taskId, status: data[0].status})
}