"use server"

import {supabaseUtils} from "@/lib/utils";
import {cookies} from "next/headers";
import {Database} from "@/types/supabase";
import {PostgrestResponse} from "@supabase/supabase-js";

type triggerTasksPayload = {
  profile: string
  userIds: string[]
}

type AsyncTask = Database['public']['Tables']['async_tasks']['Row']


export async function triggerTasks(payload: triggerTasksPayload) {
  try {
    console.log(payload);
    const supabase = supabaseUtils.createServerClient(cookies())
    const response = (await supabase.from("async_tasks").insert({
      payload,
      endpoint: "/users/signup_all"
    }).select()) as PostgrestResponse<AsyncTask>
    console.log(response);
    if (response.data) {
      const asyncTask = response.data[0]
      return asyncTask.id
    }
  } catch (error) {
    console.error(error)
  }
}