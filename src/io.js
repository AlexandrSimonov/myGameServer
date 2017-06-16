var app = require("http").createServer();
export const io = require("socket.io")(app);

app.listen(3040);
