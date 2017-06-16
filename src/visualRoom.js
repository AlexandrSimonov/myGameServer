import FabricObject from "./gameObjects/fabricObject";

export default class VisualRoom {
  constructor() {
    this.Objects = [];
  }

  action(id, user, action, data) {
    this.Objects.forEach(el => {
      if (el.id === id) {
        el.action({user, action, data});
      }
    });
  }

  visualGenerate() {
    this.Objects.push(FabricObject.createObject("Bed"));
    /*this.Objects.push(new Bed(0));
    this.Objects.push(new Bed(1));*/
    return this;
  }
}
