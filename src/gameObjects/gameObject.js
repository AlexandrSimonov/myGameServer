//

export default class gameObject {
  constructor() {}

  action(act) {
    this.actions.forEach(el => {
      if (el.name === act.action) {
        el.func(act.user, act.data);
      }
    });
  }
}
