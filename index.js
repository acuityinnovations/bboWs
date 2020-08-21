const WebSocket = require('ws');

const LOWER_BOUND = 11650.00;
const UPPER_BOUND = 12050.00;

const wss = new WebSocket.Server({ port: 5555 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  flooding(ws, LOWER_BOUND, UPPER_BOUND)
});


const flooding = (ws, b, a, direction_up = true) => {
  let step = 0.01;
  let bid = 0;
  let ask = 0;

  if(b.toFixed(2) == LOWER_BOUND) {
    direction_up = true
  } else if (b.toFixed(2) == UPPER_BOUND) {
    direction_up = false
  } else {
  }

  if(direction_up) {
    bid = b + step;
    ask = a + step;
  } else {
    bid = b - step;
    ask = a - step;
  }

  let msg = {
    "data": {
      "u": 400900217,            // order book updateId
      "E": 1568014460893,       // event time
      "T": 1568014460891,       // transaction time
      "s": "BTCUSDT",            // symbol
      "b": bid,        // best bid price
      "B": "31.21000000",        // best bid qty
      "a": ask,        // best ask price
      "A": "40.66000000"         // best ask qty
    }
  }
  // let msg = "string"
  console.log("best bid from exchange: ", b);
  ws.send(JSON.stringify(msg));

  setTimeout(() => {flooding(ws, bid, ask, direction_up)}, 1)
}
