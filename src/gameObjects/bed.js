import gameObject from "./gameObject";

export default class Bed extends gameObject {
  constructor(id) {
    super();
    this.id = id;
    this.name = "Кровать";
    this.description = "Кровать помогает востановить бодрость и отдохнуть";

    this.actions = [
      {
        name: "sleep",
        description: "Спать",
        func: this.sleep.bind(this)
      },
      {
        name: "leight",
        description: "Лежать",
        func: this.leight.bind(this)
      }
    ];
  }

  leight(user, data) {
    console.log(`${user.login} лежит на кровате ${this.id}`);
  }

  sleep(user, data) {
    console.log(`${user.login} спит на кровате ${this.id}`);
  }
}
