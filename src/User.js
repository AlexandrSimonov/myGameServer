import Rooms from "./mRoom";
import Group from "./Group";

export default class User {
  constructor(socket, login) {
    this.id = new Date().getTime() + Math.floor(Math.random() * 100000);
    this.login = null;

    this.isAuth = false;

    this.target = null;
    this.timerId = null;

    this.myRoom = null; // Ссылка на домашнюю комнату
    this.room = null; // Ссылка на комнату где находиться или map
    this.knownRooms = []; // Комнаты об которых знает юзер

    this.group = null;
    this.invites = [];

    this.coo = {
      x: 0,
      y: 0
    };

    this.socket = socket;

    this.sockets();
  }

  // Чтобы удобнее было читать конструктор
  sockets() {
    this.socket.on("newGroup", data => {
      this.group = new Group(this);
    });

    this.socket.on("move", data => {
      if (!this.isAuth) {
        return;
      }

      this.move(data.coo);
    });

    this.socket.on("disconnect", () => {
      if (this.room !== null) {
        this.room.leave(this);
      }
    });

    this.socket.on("map", () => {
      this.map();
    });

    this.socket.on("home", () => {
      this.goToHome();
    });

    this.socket.on("goToRoom", id => {
      const r = Rooms.findRoomById(Number.parseInt(id));

      if (r === null) {
        return;
      }
      r.join(this);
    });

    this.socket.on("objectAction", act => {
      if (this.room !== null) {
        this.room.visual.action(Number.parseInt(act.id), this, act.action, act.data);
      }
    });

    this.socket.on("goToRandomRoom", () => {
      this.goToRandomRoom();
    });

    this.socket.on("yesInvite", id => {
      this.invites.find(el => el.id === Number.parseInt(id)).yes();
    });

    this.socket.on("noInvite", id => {
      this.invites.find(el => el.id === Number.parseInt(id)).no();
    });
  }

  resInvites() {
    console.log(this.invites);
    this.socket.emit(
      "invites",
      this.invites.map(el => {
        return {id: el.id, message: el.message};
      })
    );
  }

  // Вспомогательный метод
  returnKnowsRoomsID() {
    return this.knownRooms.map(el => {
      return {
        id: el.id
      };
    });
  }

  // Метод добавления новой комнаты в "изведанные"
  addKnownRoom(room) {
    if (this.knownRooms.find(el => room === el) === undefined) {
      this.knownRooms.push(room);
      this.socket.emit("knownRooms", this.returnKnowsRoomsID());
    }
  }

  // Выход на карту
  map() {
    if (this.room !== null) {
      this.room.leave(this);
    }

    this.socket.emit("map");
  }

  // Возврат домой
  goToHome() {
    if (this.myRoom !== null) {
      this.myRoom.join(this);
    }
  }

  goToRandomRoom() {
    Rooms.getRandomRoom().join(this);
  }

  reg(login, room) {
    if (this.isAuth) {
      return;
    }

    this.login = login;
    this.myRoom = room;
    room.join(this);

    this.auth(login);
  }

  auth(login) {
    if (login === this.login) {
      this.isAuth = true;
    }

    this.socket.emit("initAuth", {
      id: this.id,
      login: this.login,
      room: this.room.id,
      myRoom: this.myRoom.id,
      knownRooms: this.returnKnowsRoomsID()
    });
  }

  move(coo) {
    clearInterval(this.timerId);
    this.timerId = setInterval(
      () => {
        if (coo.x !== this.coo.x) {
          let p = coo.x - this.coo.x;
          let x = 0;

          if (p > 0) {
            x = 1;
          } else {
            x = -1;
          }

          this.coo.x += x;
        }

        if (coo.y !== this.coo.y) {
          let p = coo.y - this.coo.y;
          let y = 0;

          if (p > 0) {
            y = 1;
          } else {
            y = -1;
          }

          this.coo.y += y;
        }

        if (coo.x === this.coo.x && coo.y === this.coo.y) {
          clearInterval(this.timerId);
        }
      },
      20
    );
  }
}
