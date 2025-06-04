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


const profiles = ["admin", "manager"]

interface AddModalProps {
  employees: Employee[]
}

export default function AddModal({employees}: AddModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<string | undefined>("admin")
  const [employeesChecked, setEmployeesChecked] = useState<string[]>([])

  const handleSubmit = () => {
    setIsLoading(true)
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

  return (
    <div className="rounded-md overflow-auto h-[6vh] w-[90vw] relative">
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center space-x-2">
            <div> Add users</div>
            <FiUserPlus/>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="flex flex-col gap-y-2 overflow-hidden justify-center items-center">
            <form onSubmit={handleSubmit}>
              <Label htmlFor="position">Select position</Label>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Input id="position" value={profile}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {profiles.map((p) => (
                    <DropdownMenuItem key={p} onSelect={() => handleProfileSelect(p)}>{p}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="secondary" className="mt-4 w-full">
                    Select users to add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
              <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}