"use client"
import { Input } from "@/components/ui/input";
import ky from "ky";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function APIPage() {
    const [value, setValue] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [alert, setAlert] = useState<string>('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const response = await ky.post("/api/example", {
                json: { number: value },
            });
            console.log(response.ok)
            if (!response.ok) {
                setAlert('Invalid API call')
            }
            else {
                setAlert('Valid API call')
            }
        } catch (error) {
            setAlert('Invalid API call')
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="flex flex-col gap-y-2 overflow-hidden justify-center items-center ">
            <h1>Enter a single digit number</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    onChange={(event) => {
                        const num = event.target.value;
                        setValue(num);
                    }}
                    value={value ?? ""}
                />
                <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
                    Submit
                </Button>
            </form>
            {alert && alert}
        </div>
    );
}
