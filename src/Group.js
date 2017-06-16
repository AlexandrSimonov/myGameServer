import IBase from "./IBase";
import Invite from "./Invite";
import Users from "./mUser";

export default class Group extends IBase {
  constructor(leader) {
    super(leader);

    this.leader.socket.emit("groupCreated", {
      leader: {id: this.leader.id, login: this.leader.login},
      id: this.id,
      users: (() => {
        return this.users.map(el => {
          return {login: el.login, id: el.id};
        });
      })(),
      invites: (() => {
        return this.invites.map(el => {
          return {id: el.id, login: el.user.login};
        });
      })()
    });
  }

  sockets() {
    this.leader.socket.on("inviteToGroup", data => {
      new Invite(this, Users.getUserById(Number.parseInt(data.id)), data.message);
    });

    this.leader.socket.on("deleteGroup", () => {
      this.groupDelete();
    });

    this.leader.socket.on("changeLeader", id => {
      const usr = this.users.find(el => {
        return el.id === id;
      });

      this.changeLeader(usr);
    });

    this.leader.socket.on("roomChange", () => {
      io.to(this.id).emit("leaderChangeRoom", {message: `${this.leader.login} изменил комнату`});
    });

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].socket.on("disconnect", () => {
        this.users.splice(i, 1);

        if (this.users[i] === this.leader) {
          this.leader.group = null;

          if (this.users.length > 0) {
            this.changeLeader(this.users[0]);
          } else {
            delete this;
          }
        }
      });
    }
  }

  join(user) {
    this.users.forEach(usr => {
      usr.socket.emit("groupChangeUsers", {
        users: (() => {
          return this.users.map(el => {
            return {login: el.login, id: el.id};
          });
        })(),
        invites: (() => {
          return this.invites.map(el => {
            return {id: el.id, login: el.user.login};
          });
        })()
      });
    });
  }

  groupDelete() {
    this.users.forEach(el => {
      el.group = null;
    });

    this.deleteIBase("groupDelete", `Группа ${this.id} была распущена!`);
  }

  changeLeader(user) {
    this.leader = user;

    this.leader.socket.emit("newLeader", {message: "Вы новый лидер"});

    io.to(this.id).emit("newLeader", {
      message: `В группе ${this.id} появился новый лидер ${this.leader.login}`
    });
  }
}
