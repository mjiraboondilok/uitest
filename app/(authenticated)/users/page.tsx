import {supabaseUtils} from "@/lib/utils"
import {cookies} from "next/headers"
import {Database} from "@/types/supabase"
import {DataTable} from "@/components/data-table";
import {columns, User} from "./columns";
import AddModal from "@/app/(authenticated)/users/add-modal";
import {getEmployeeData} from "@/app/(authenticated)/employee/page";

type UsersTable = Database['public']['Tables']['user_api']['Row']

async function getUsersData() {
  const supabase = supabaseUtils.createServerClient(cookies())
  const {data, error} = await supabase.from("user_api").select("id, name, profile").returns<UsersTable[]>()
  if (error || !data) {
    console.error(error)
    return []
  }
  return data.map(user => ({
    id: user.id,
    name: user.name,
    profile: user.profile
  })) as User[]
}

export default async function UsersPage() {
  const data = await getUsersData()
  const employeeData = await getEmployeeData()

  const userIds = data.map(user => user.id)
  const missingEmployees = employeeData.filter(employee => !userIds.includes(employee.id))

  return (
    <>
      <div className="flex overflow-hidden justify-center">
        <AddModal employees={missingEmployees}/>
      </div>
      <div className="flex overflow-hidden justify-center">
        <DataTable columns={columns} data={data}/>
      </div>
    </>
  )
}