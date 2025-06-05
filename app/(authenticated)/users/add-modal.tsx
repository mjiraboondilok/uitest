"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Employee} from "@/app/(authenticated)/employee/columns";
import {FiUserPlus} from 'react-icons/fi';
import {triggerTasks} from "@/app/(authenticated)/users/actions";
import ky from "ky";

const profiles = ["admin", "manager"]

interface AddModalProps {
  employees: Employee[]
}

export default function AddModal({employees}: AddModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<string>("admin")
  const [employeesChecked, setEmployeesChecked] = useState<string[]>([])
  const [taskId, setTaskId] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      const response = await triggerTasks({profile, userIds: employeesChecked})
      if (!response) {
        console.warn("Failed to trigger task")
      } else {
        console.warn("enqueued task")
        await tryEnqueueTaskTrigger(response)
      }
    } catch (error) {
      console.warn("Failed to trigger task")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSelect = (profile: string) => {
    setProfile(profile)
  }

  const handleEmployeeSelect = (event: Event, id: string) => {
    event.preventDefault()
    if (employeesChecked.includes(id)) {
      setEmployeesChecked(employeesChecked.filter(e => e !== id))
    } else {
      setEmployeesChecked([...employeesChecked, id])
    }
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setProfile("admin")
      setEmployeesChecked([])
    }
  }

  const tryEnqueueTaskTrigger = async (taskId: string) => {
    try {
      const response = await ky.post("/api/tasks", {
        json: {id: taskId},
      });
      if (!response.ok) {
        console.warn("Failed to trigger task")
      } else {
        const data = await response.json() as { id: string }
        setTaskId(data.id)
      }
    } catch (error) {
      console.warn("Failed to trigger task")
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedEmployees = () => {
    return employees.filter(e => employeesChecked.includes(e.id))
      .map(e => e.name)
      .join(", ")
  }

  const submitDisabled = () => {
    return isLoading || employeesChecked.length <= 0
  }

  return (
    <div className="rounded-md overflow-auto h-[6vh] w-[90vw] relative">
      <Popover onOpenChange={(open) => handleOnOpenChange(open)}>
        <PopoverTrigger>
          <div className="flex items-center space-x-2">
            <div> Add users</div>
            <FiUserPlus/>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="flex flex-col gap-y-2 overflow-hidden justify-center items-center">
            <form onSubmit={handleSubmit}>
              <Label htmlFor="position">Profile</Label>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Input id="position" value={profile} readOnly/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {profiles.map((p) => (
                    <DropdownMenuItem key={p} onSelect={() => handleProfileSelect(p)}>{p}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <Label htmlFor="users">Select users to add</Label>
                <DropdownMenuTrigger>
                  <Input id="users" value={getSelectedEmployees()} readOnly/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {employees.map((e) => (
                    <DropdownMenuCheckboxItem
                      key={e.id}
                      onSelect={(event) => handleEmployeeSelect(event, e.id)}
                      checked={employeesChecked.includes(e.id)}
                    >
                      {e.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="submit" className="mt-4 w-full" disabled={submitDisabled()}>
                Submit
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}