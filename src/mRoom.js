import Room from "./Room";

export default new class Rooms {
  constructor() {
    this.arrRooms = []; // Массив существующих комнат в игре
    this.addRoom();
    this.addRoom();
  }

  getRandomRoom() {
    return this.addRoom();
  }

  addRoom() {
    const r = new Room();
    this.arrRooms.push(r);
    return r;
  }

  findRoomById(id) {
    return this.arrRooms.find(el => id === el.id);
  }
}();
