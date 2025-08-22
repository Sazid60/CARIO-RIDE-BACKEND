/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/utils/seedAdmin";
import { Server as SocketIOServer } from "socket.io";

let server: Server;
let io: SocketIOServer;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected To MongoDb");

    // Keep your app.listen structure
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is Running On Port ${envVars.PORT}`);
    });

    // Attach Socket.IO to the same server
    io = new SocketIOServer(server, {
      cors: { origin: "*" }, // adjust in production
    });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("joinRideRoom", ({ rideId }) => {
        console.log(`Socket ${socket.id} joined ride room ${rideId}`);
        socket.join(rideId);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedAdmin();
})();

// Keep all your existing shutdown logic exactly the same
process.on("SIGTERM", (err) => {
  console.log("Signal Termination Happened...! Server Is Shutting Down !", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("I am manually Closing the server! Server Is Shutting Down !");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", () => {
  console.log("Unhandled Rejection Happened...! Server Is Shutting Down !");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Happened...! Server Is Shutting Down !", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Export io for controllers
export { io };
