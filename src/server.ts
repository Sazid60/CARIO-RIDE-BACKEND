
import { Server } from "http"
import mongoose from "mongoose"
import app from "./app"
import { envVars } from "./app/config/env"
let server: Server

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected To MongoDb")
        server = app.listen(envVars.PORT, () => {
            console.log(`Server Is Running On Port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()

process.on("SIGTERM", () => {
    console.log("SIGTERM signal received... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("I am manually Closing the server! Server Is Shutting Down !")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})


process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection Happened...! Server Is Shutting Down !")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})


process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Happened...! Server Is Shutting Down !", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})