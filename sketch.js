let font
let logo

function preload() {
  font = loadFont("assets/PatrickHandSC-Regular.ttf");
  logo = loadImage("assets/logo.png");
}

let scrollPos = 0;

const canvasProps = {
  width: 1920,
  height: 1080,
  center: {
    x: 960,
    y: 540
  }
}

const entryLayout = {
  marginLeft: 50,
  marginRight: -50,
  marginVertical: 150,
  marginVerticalTrain: 15,
  marginVerticalTarget: 8,
  width: canvasProps.width / 2 - 50,
  height: 50,
  morningTimeRange: {
    min: 480,
    max: 570,
  },
  eveningTimeRange: {
    min: 990,
    max: 1080,
  },
  transferTime: 1 // TODO: check if this makes sense for metro transfer KN
}

let days = []

Object.keys(entries).forEach(date => {
  const entry = entries[date]
  let parsedDay = {
    date: entry.dayNum,
    day: entry.day,
    morning: {
      cost: entry.costMorning,
      checkIn: entry.checkInMorning,
      checkOut: entry.checkOutMorning,
      changeTime: entry.changeTimeMorning,
      targetTime: entry.targetTimeMorning,
      mode: entry.modeMorning,
      secondMode: entry.secondModeMorning
    },
    evening: {
      cost: entry.costEvening,
      checkIn: entry.checkInEvening,
      checkOut: entry.checkOutEvening,
      changeTime: entry.changeTimeEvening,
      targetTime: entry.targetTimeEvening,
      mode: entry.modeEvening,
      secondMode: entry.secondModeEvening
    }
  }
  days.push(parsedDay)
});

let maxScrollPos = -((days.length + 3) * entryLayout.height - canvasProps.height + entryLayout.marginVertical)

function setup() {
  createCanvas(1920, 1080)

  flex({
    canvas: {
      fit: CONTAIN
    }
  })

  pixelDensity(2)
}

function draw() {
  background(255)
  drawScaleUnderlay()

  push()
  translate(0, scrollPos)
  drawDays()
  pop()

  console.log(mouseX)

  drawSurroundings()
}

const drawSurroundings = () => {
  fill(255)

  noStroke()
  rectMode(CORNER)
  rect(0, 0, canvasProps.width, entryLayout.marginVertical)
  rect(0, canvasProps.height - entryLayout.marginVertical, canvasProps.width, entryLayout.marginVertical)
  rect(0, 0, entryLayout.marginLeft, canvasProps.height)
  rect(canvasProps.width, 0, entryLayout.marginRight, canvasProps.height)


  noFill()
  stroke(0)
  strokeWeight(3)
  rect(entryLayout.marginLeft, entryLayout.marginVertical, canvasProps.width + 2 * entryLayout.marginRight, canvasProps.height - 2 * entryLayout.marginVertical)

  drawLegend()

  drawScaleTop()

  drawTitle()
}

const drawTitle = () => {
  push()
  translate(0, entryLayout.marginVertical / 2)

  fill(0)
  textAlign(CENTER, BASELINE)
  textSize(60)
  noStroke()
  textFont(font)
  text("Dear       , you are not the only one tracking me.", canvasProps.center.x, 0)
  imageMode(CENTER)
  image(logo, 594, -15, 90, 90);
  pop()
}

const drawScaleUnderlay = () => {
  stroke(200)
  strokeWeight(2)

  const morningTimes = [495, 510, 525, 540, 555]

  morningTimes.forEach(time => {
    const xPos = map(time, entryLayout.morningTimeRange.min, entryLayout.morningTimeRange.max, entryLayout.marginLeft, canvasProps.center.x)
    line(xPos, entryLayout.marginVertical, xPos, canvasProps.height - entryLayout.marginVertical)
  })

  const eveningTimes = [1005, 1020, 1035, 1050, 1065]

  eveningTimes.forEach(time => {
    const xPos = map(time, entryLayout.eveningTimeRange.min, entryLayout.eveningTimeRange.max, canvasProps.center.x, canvasProps.width + entryLayout.marginRight)
    line(xPos, entryLayout.marginVertical, xPos, canvasProps.height - entryLayout.marginVertical)
  })
}

const drawScaleTop = () => {
  fill(0)
  textAlign(CENTER, BASELINE)
  textSize(25)
  noStroke()
  textFont(font)

  const morningTimes = [
    { time: 480, text: "8:00" },
    { time: 495, text: "8:15" },
    { time: 510, text: "8:30" },
    { time: 525, text: "8:45" },
    { time: 540, text: "9:00" },
    { time: 555, text: "9:15" },
    { time: 570, text: "" },
  ]


  morningTimes.forEach(time => {
    const xPos = map(time.time, entryLayout.morningTimeRange.min, entryLayout.morningTimeRange.max, entryLayout.marginLeft, canvasProps.center.x)
    text(time.text, xPos, entryLayout.marginVertical - 15)
  })

  const eveningTimes = [
    { time: 1005, text: "16:45" },
    { time: 1020, text: "17:00" },
    { time: 1035, text: "17:15" },
    { time: 1050, text: "17:30" },
    { time: 1065, text: "17:45" },
    { time: 1080, text: "18:00" },
  ]

  eveningTimes.forEach(time => {
    const xPos = map(time.time, entryLayout.eveningTimeRange.min, entryLayout.eveningTimeRange.max, canvasProps.center.x, canvasProps.width + entryLayout.marginRight)
    text(time.text, xPos, entryLayout.marginVertical - 15)
  })
}

const drawLegend = () => {
  push()
  translate(0, canvasProps.height - entryLayout.marginVertical / 2)
  stroke("#B127C6")
  strokeWeight(5)
  line(100, 25, 100, -5)
  fill(0)
  noStroke()
  textAlign(LEFT, CENTER)
  textSize(31)
  textFont(font)
  text("Attempted Arrival", 115, 5)

  text("Workday", 470, 5)

  text("S–Train", 720, 5)

  text("Metro", 950, 5)

  text("Regional Train", 1160, 5)

  text("InterCity Train", 1460, 5)

  text("Bus", 1750, 5)

  textSize(25)
  textAlign(CENTER, CENTER)
  text("Waking Up", 55, -55)
  text("Morning Commute", 500, -55)
  text("On The Job", canvasProps.center.x, -55)
  text("Evening Commute", 1420, -55)
  text("Hungry", 1870, -55)


  rectMode(RADIUS)

  fill(0, 50, 150, 40)
  stroke(0, 0, 0, 30)
  strokeWeight(1)
  rect(450, 10, 10, 10, 5)


  stroke(0)
  strokeWeight(3)

  fill("#F2AC16")
  rect(1730, 10, 10, 10, 5)

  fill("#2DB281")
  rect(1440, 10, 10, 10, 5)

  fill("#2274AE")
  rect(1140, 10, 10, 10, 5)

  fill("#e9e9e9")
  rect(930, 10, 10, 10, 5)

  fill("#D61B1B")
  rect(700, 10, 10, 10, 5)

  pop()
}

const drawDays = () => {
  days.forEach((dayProps, i) => {
    const yPos = i * entryLayout.height + entryLayout.marginVertical
    drawDay(yPos, dayProps)
  });
}

const drawDay = (yPos, dayProps) => {
  push()
  translate(0, yPos);
  drawEntry(entryLayout.marginLeft, dayProps.morning, "morning", dayProps.day)
  drawEntry(canvasProps.center.x, dayProps.evening, "evening", dayProps.day)
  drawCenter(dayProps.date, dayProps.day)
  pop()
}

const drawCenter = (date, day) => {
  if (day == "Saturday" || day == "Sunday") {
    fill(235)
    stroke(150)
  } else {
    fill(255)
    stroke(0)
  }
  strokeWeight(2)
  rectMode(CENTER)
  rect(canvasProps.center.x, entryLayout.height / 2, 110, entryLayout.height - 2 * entryLayout.marginVerticalTarget, 50)

  if (day == "Saturday" || day == "Sunday") {
    fill(150)
  } else {
    fill(0)
  }
  noStroke()
  textAlign(CENTER, CENTER)
  textSize(31)
  textFont(font)
  text(`${day.substr(0, 3).toUpperCase()} ${date}`, canvasProps.center.x, entryLayout.height / 2 - 5)
}


const drawEntry = (xPos, entryProps, mode, day) => {
  push()
  translate(xPos, 0);
  if (day == "Saturday" || day == "Sunday") {
    fill(0, 0, 0, 20)
    stroke(150)
  } else {
    noFill()
    stroke(0)
  }
  strokeWeight(2)
  rectMode(CORNER)
  rect(0, 0, entryLayout.width, entryLayout.height)
  drawTimeline(entryProps, mode, day)

  if (day == "Saturday") {
    stroke(0)
    strokeWeight(2)
    line(0, 0, entryLayout.width, 0)
  }
  pop()
}

const drawTimeline = (entryProps, mode, day) => {
  let timeRange;
  if (mode == "morning") {
    timeRange = entryLayout.morningTimeRange;
  } else {
    timeRange = entryLayout.eveningTimeRange;
  }

  if (day != "Saturday" && day != "Sunday" && day != "Wednesday") {
    const workStart = map(540, timeRange.min, timeRange.max, 0, entryLayout.width)
    const workEnd = map(540, timeRange.min, timeRange.max, 0, entryLayout.width)
    fill(0, 50, 150, 20)
    noStroke()
    rect(workStart, 0, workEnd, entryLayout.height)
  }

  stroke(0)
  if (entryProps.changeTime) {
    // draw first train
    let firstTrainStart = map(entryProps.checkIn, timeRange.min, timeRange.max, 0, entryLayout.width)
    let firstTrainEnd = map(entryProps.changeTime - entryLayout.transferTime, timeRange.min, timeRange.max, 0, entryLayout.width)
    drawTrain(firstTrainStart, firstTrainEnd, entryProps.mode)

    // draw second train
    let secondTrainStart = map(entryProps.changeTime, timeRange.min, timeRange.max, 0, entryLayout.width)
    let secondTrainEnd = map(entryProps.checkOut, timeRange.min, timeRange.max, 0, entryLayout.width)
    drawTrain(secondTrainStart, secondTrainEnd, entryProps.secondMode)
  } else {
    let firstTrainStart = map(entryProps.checkIn, timeRange.min, timeRange.max, 0, entryLayout.width)
    let firstTrainEnd = map(entryProps.checkOut, timeRange.min, timeRange.max, 0, entryLayout.width)
    drawTrain(firstTrainStart, firstTrainEnd, entryProps.mode)
  }

  if (entryProps.targetTime) {
    drawTargetTime(entryProps.targetTime, timeRange)
  }
}

const drawTrain = (start, stop, mode) => {
  if (mode == "train") {
    fill("#D61B1B")
  } else if (mode == "metro") {
    fill("#e9e9e9")
  } else if (mode == "regional") {
    fill("#2274AE")
  } else if (mode == "IC") {
    fill("#2DB281")
  } else if (mode == "bus") {
    fill("#F2AC16")
  }
  strokeWeight(3)
  rectMode(CORNER)
  rect(start, entryLayout.marginVerticalTrain, stop - start, entryLayout.height - 2 * entryLayout.marginVerticalTrain, 5)
}

const drawTargetTime = (targetTime, timeRange) => {
  const xPos = map(targetTime, timeRange.min, timeRange.max, 0, entryLayout.width)

  stroke("#B127C6")
  strokeWeight(5)
  line(xPos, entryLayout.marginVerticalTarget, xPos, entryLayout.height - entryLayout.marginVerticalTarget)
}

function mouseWheel(event) {
  scrollPos -= event.delta;
  scrollPos = constrain(scrollPos, maxScrollPos, 0)
}