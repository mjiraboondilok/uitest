import {ColumnDef} from "@tanstack/react-table"

export type User = {
  id: string
  name: string
  profile: "admin" | "manager"
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "profile",
    header: "Profile",
  },
]