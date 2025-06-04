import {supabaseUtils} from "@/lib/utils"
import {cookies} from "next/headers"
import { Database } from "@/types/supabase"
import {DataTable} from "@/components/data-table";
import {columns} from "./columns";

type UsersTable = Database['public']['Tables']['user_api']['Row']

async function getUsersData() {
    const supabase = supabaseUtils.createServerClient(cookies())
    const { data, error } = await supabase.from("user_api").select("name, profile").returns<UsersTable[]>()
    if (error || !data) {
        console.error(error)
        return []
    }
    return data.map(user => ({
        name: user.name,
        profile: user.profile
    }))
}

export default async function UsersPage() {
    const data = await getUsersData()

    return (
        <div className="flex overflow-hidden justify-center">
            <DataTable columns={columns} data={data} />
        </div>
    )
}