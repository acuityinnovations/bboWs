const WebSocket = require('ws');


const LOWER_BOUND = 11700.00;
const UPPER_BOUND = 12000.00;

const GAP = 20;

const oDWss = new WebSocket.Server({ port: 5556 });
const bboWss = new WebSocket.Server({ port: 5555 });

oDWss.on('connection', function connection(wss) {
  wss.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  id = Date.now()
  oDflooding(wss, 11820.00, 11820.01, true, id)
});

const randomFromInterval = (min, max) => {
  return (Math.random() * (max - min + 1) + min).toFixed(2);
}

const oDflooding = (ws, b, a, direction_up = true, id) => {
  let step = 0.01;
  let bid1 = 0;
  let ask1 = 0;

  if(b.toFixed(2) == (LOWER_BOUND - GAP)) {
    direction_up = true
  } else if (b.toFixed(2) == (UPPER_BOUND - GAP)) {
    direction_up = false
  } else {
  }

  if(direction_up) {
    bid1 = b + step;
    bid2 = b + 2 * step
    bid3 = b + 3 * step

    ask1 = a + step;
    ask2 = a + 2 * step
    ask3 = a + 3 * step
  } else {
    bid1 = b - step;
    bid2 = b - 2 * step
    bid3 = b - 3 * step

    ask1 = a - step;
    ask2 = a - 2 * step
    ask3 = a - 3 * step
  }

  let msg = {
    "data": {
      "E": 1597984345693,
      "T": 1597984345687,
      "U": id - 100,
      "a": [[ask1, randomFromInterval(0, 5)],
            [ask2, randomFromInterval(0, 5)],
            [ask3, randomFromInterval(0, 5)]],
      "b": [[bid1, randomFromInterval(0, 5)],
            [bid2, randomFromInterval(0, 5)],
            [bid3, randomFromInterval(0, 5)]],
      "e": "depthUpdate",
      "pu": id - 1,
      "s": "BTCUSDT",
      "u": id
    }
  }
  // console.log("delta from exchange: ", msg);
  console.log("delta bid from exchange: ", bid1);
  ws.send(JSON.stringify(msg));

  setTimeout(() => {oDflooding(ws, bid1, ask1, direction_up, id + 1)}, 1)
}


bboWss.on('connection', function connection(wss) {
  wss.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  bboFlooding(wss, LOWER_BOUND, UPPER_BOUND)
});


const bboFlooding = (wss, b, a, direction_up = true) => {
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
  wss.send(JSON.stringify(msg));

  setTimeout(() => {bboFlooding(wss, bid, ask, direction_up)}, 1)
}
