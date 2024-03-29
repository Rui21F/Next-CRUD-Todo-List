"use client"

import { Task } from "@/app/models/task"
import { FormEvent, useEffect, useState } from "react"
import { remult } from "remult"
import { TasksController } from "./TasksController"
import { signIn, signOut, useSession } from "next-auth/react"
import { UserInfo } from "remult"

const taskRepo = remult.repo(Task)

export default function Todo() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const session = useSession()

    useEffect(() => {
        remult.user = session.data?.user as UserInfo
        if (session.status === "unauthenticated") signIn()
        else if (session.status === "authenticated")
            return taskRepo
                .liveQuery({
                    orderBy: {
                        createdAt: "asc",
                    },
                    where: {
                        completed: undefined,
                    },
                })
                .subscribe((info) => setTasks(info.applyChanges))
    }, [session])
    async function addTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            const newTask = await taskRepo.insert({ title: newTaskTitle })
            setTasks([...tasks, newTask])
            setNewTaskTitle("")
        } catch (err: any) {
            alert(err.message)
        }
    }
    async function setCompleted(task: Task, completed: boolean) {
        const updatedTask = await taskRepo.save({ ...task, completed })
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    }

    async function deleteTask(task: Task) {
        try {
            await taskRepo.delete(task)
            setTasks(tasks.filter((t) => t.id !== task.id))
        } catch (err: any) {
            alert(err.message)
        }
    }

    async function setAllCompleted(completed: boolean) {
        TasksController.setAllCompleted(completed)
    }

    if (session.status !== "authenticated") return <></>
    return (
        <div>
            <h1>{tasks.length} Things to do</h1>
            <main>
                <div>
                    <span>Hello {remult.user?.name}</span>
                    <button onClick={() => signOut()}>Sign Out</button>
                </div>
                {taskRepo.metadata.apiInsertAllowed() && (< form onSubmit={addTask}>
                    <input value={newTaskTitle} placeholder="What to you need to do?"
                        onChange={e => setNewTaskTitle(e.target.value)} />
                    <button>Add</button>
                </form>
                )}

                {tasks.map((task) => {
                    return (
                        <div key={task.id}>
                            <input type="checkbox"
                                checked={task.completed}
                                onChange={(e) => setCompleted(task, e.target.checked)} />
                            <span>{task.title} </span>
                            <button onClick={() => deleteTask(task)}>Delete</button>
                        </div>
                    )
                })}
                <div>
                    <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
                    <button onClick={() => setAllCompleted(false)}>Set All Completed</button>
                </div>
            </main>
        </div >
    )
}
