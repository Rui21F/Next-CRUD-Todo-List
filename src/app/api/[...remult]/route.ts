import { Task } from "@/app/models/task";
import { TasksController } from "@/components/TasksController";
import { remultNextApp } from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { getUserOnServer } from "../auth/[...nextauth]/route";

const api = remultNextApp({
    entities: [Task],
    controllers: [TasksController],
    dataProvider: createPostgresDataProvider({
        connectionString:process.env["DATABASE_URL"],
    }),
    getUser: getUserOnServer,
})
export const { GET, PUT, POST, DELETE } = api