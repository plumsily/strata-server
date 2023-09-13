import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("draw", (data) => {
    // Broadcast the drawing data to all connected clients
    console.log("drawing");
    socket.broadcast.emit("draw", data);
  });
  socket.on("modify", (data) => {
    console.log(`Object with id ${data.id} modified with data: `, data);

    // broadcast the modify event to all other clients
    socket.broadcast.emit("modify", data);
  });
  socket.on("userJoined", (data) => {
    const { name, userId, roomId } = data;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
  });
  socket.on("text", (data) => {
    console.log("adding text");
    socket.broadcast.emit("text", data);
  });
});

httpServer.listen(port, () => {
  console.log("Socket.IO server running on port 5000");
});
