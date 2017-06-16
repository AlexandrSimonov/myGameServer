import Bed from "./bed";

export default new class FabricObject {
  constructor() {
    this.objects = [];

    this.objects.push(Bed);
  }

  createObject(type) {
    const obj = this.objects.find(el => el.name === type);

    if (obj !== null) {
      return new obj();
    }
    return new Error("Нет такого типа");
  }

  createGroupObject(types) {
    const arrObj = [];

    types.forEach(el => {
      arrObj.push(this.createObject(el));
    });

    return arrObj;
  }
}();
