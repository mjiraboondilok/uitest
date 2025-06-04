import { ColumnDef } from "@tanstack/react-table"

export type User = {
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