import Invite from "./Invite";
import Users from "./mUser";
import {io} from "./io";

export default class IBase {
  constructor(leader) {
    this.id = new Date().getTime() + Math.floor(Math.random() * 100000);
    this.leader = leader; // user
    this.users = [];

    this.users.push(leader);

    this.invites = [];

    this.sockets();
  }

  // переопределить!
  sockets() {}

  deleteIBase(t, message) {
    this.invites.forEach(el => {
      el.cancelInvite();
    });

    io.to(this.id).emit(t, {message});

    delete this;
  }
}
