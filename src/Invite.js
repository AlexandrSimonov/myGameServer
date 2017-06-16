//Нужно обстрагировать общее поведение инвайты похожие как для чатов, так и для групп и прчего

export default class Invite {
  constructor(objectInvite, user, message) {
    this.id = new Date().getTime() + Math.floor(Math.random() * 100000);
    this.objectInvite = objectInvite;
    this.user = user;
    this.message = message;

    objectInvite.invites.push(this);
    this.user.invites.push(this);

    this.user.resInvites();
    console.log("NEW INVITE");
  }

  cancelInvite() {
    for (let i = 0; i < this.user.invites.length; i++) {
      if (this.user.invites[i] === this) {
        this.user.invites.splice(i, 1);
      }
    }

    for (let i = 0; i < this.objectInvite.invites.length; i++) {
      if (this.objectInvite.invites[i] === this) {
        this.objectInvite.invites.splice(i, 1);
      }
    }

    this.user.resInvites();

    delete this;
  }

  // Ещё можно сообщать лидерам, что и по чем

  yes() {
    this.objectInvite.users.push(this.user);
    this.objectInvite.join(this.user);
    this.cancelInvite();
  }

  no() {
    this.cancelInvite();
  }
}
