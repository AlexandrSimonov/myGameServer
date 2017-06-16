import User from "./User";
import Rooms from "./mRoom";
import {io} from "./io";

export default new class Users {
  constructor() {
    this.users = [];

    io.on("connection", socket => {
      console.log("user connect");
      this.addUser(socket);
      socket.emit("mees", {message: "Hello"});
    });
  }

  getUserById(id) {
    return this.users.find(el => id === el.id);
  }

  addUser(socket) {
    const user = new User(socket);

    this.users.push(user);

    socket.on("reg", data => {
      user.reg(data, Rooms.addRoom());
    });

    socket.on("auth", data => {
      user.auth(data);
    });
  }
}();
