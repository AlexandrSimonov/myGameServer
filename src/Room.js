import {io} from "./io";
import VisualRoom from "./visualRoom";

export default class Room {
  constructor() {
    this.id = new Date().getTime() + Math.floor(Math.random() * 100000);
    this.name = "";
    this.users = [];

    this.visual = new VisualRoom().visualGenerate();

    this.intID = null;
  }

  update() {
    if (this.users.length === 0) {
      clearInterval(this.intID);
      this.intID = null;
    } else if (this.intID === null) {
      this.intID = setInterval(
        () => {
          io.to(this.id).emit("obn", {
            users: this.users.map(el => {
              return {
                coo: el.coo,
                login: el.login
              };
            })
          });
        },
        16
      );
    }
  }

  changeRoom(user, room) {
    user.room = room;

    user.socket.emit("changeRoom", user.room.id);
  }

  join(user) {
    if (user.room !== null) {
      user.room.leave(user);
    }

    this.users.push(user);

    user.socket.join(this.id);

    this.changeRoom(user, this);
    user.addKnownRoom(this);

    user.socket.emit(
      "objects",
      this.visual.Objects.map(el => {
        return {
          id: el.id,
          name: el.name,
          description: el.description,
          actions: el.actions.map(el2 => {
            return {
              name: el2.name,
              description: el2.description
            };
          })
        };
      })
    );

    this.update();
  }

  leave(user) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) {
        this.users.splice(i, 1);
      }
    }

    user.socket.leave(this.id);

    this.update();
  }
}
