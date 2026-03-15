let font
let fontBold

function preload() {
  font = loadFont("assets/Sniglet-Regular.ttf");
  fontBold = loadFont("assets/Sniglet-ExtraBold.ttf");
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
  marginVerticalTrain: 20,
  marginVerticalTarget: 10,
  width: canvasProps.width / 2 - 50,
  height: 75,
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
    date: date,
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

let maxScrollPos = -((days.length + 1) * entryLayout.height - canvasProps.height + entryLayout.marginVertical)

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
  strokeWeight(1)
  rect(entryLayout.marginLeft, entryLayout.marginVertical, canvasProps.width + 2 * entryLayout.marginRight, canvasProps.height - 2 * entryLayout.marginVertical)

  drawLegend()

  drawScaleTop()
}

const drawScaleUnderlay = () => {
  stroke(0)
  strokeWeight(1)

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
  fill(100)
  textAlign(CENTER, BASELINE)
  textSize(20)
  noStroke()
  textFont(font)

  const morningTimes = [
    { time: 480, text: "8:00" },
    { time: 495, text: "8:15" },
    { time: 510, text: "8:30" },
    { time: 525, text: "8:45" },
    { time: 540, text: "9:00" },
    { time: 555, text: "9:15" },
  ]


  morningTimes.forEach(time => {
    const xPos = map(time.time, entryLayout.morningTimeRange.min, entryLayout.morningTimeRange.max, entryLayout.marginLeft, canvasProps.center.x)
    text(time.text, xPos, entryLayout.marginVertical - 10)
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
    text(time.text, xPos, entryLayout.marginVertical - 10)
  })
}

const drawLegend = () => {
  push()
  translate(0, canvasProps.height - entryLayout.marginVertical / 2)
  stroke(100, 150, 255)
  strokeWeight(5)
  line(100, 30, 100, -30)
  fill(0)
  noStroke()
  textAlign(LEFT, CENTER)
  textSize(25)
  textFont(font)
  text("When I Tried To Arrive", 110, 0)

  text("S–Train", 400, 0)

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
  fill(255)
  stroke(0)
  strokeWeight(2)
  rectMode(CENTER)
  rect(canvasProps.center.x, entryLayout.height / 2, 120, entryLayout.height - 2 * entryLayout.marginVerticalTarget, 50)

  fill(0)
  noStroke()
  textAlign(CENTER, CENTER)
  textSize(25)
  textFont(font)
  text(`${day.substr(0, 3).toUpperCase()} ${date}`, canvasProps.center.x, entryLayout.height / 2 + 3)
}


const drawEntry = (xPos, entryProps, mode, day) => {
  push()
  translate(xPos, 0);
  if (day == "Saturday" || day == "Sunday") {
    fill(0, 0, 0, 30)
  } else {
    noFill()
  }
  stroke(0)
  strokeWeight(2)
  rectMode(CORNER)
  rect(0, 0, entryLayout.width, entryLayout.height)
  drawTimeline(entryProps, mode)
  pop()
}

const drawTimeline = (entryProps, mode) => {
  let timeRange;
  if (mode == "morning") {
    timeRange = entryLayout.morningTimeRange;
  } else {
    timeRange = entryLayout.eveningTimeRange;
  }

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
    fill(0)
  } else if (mode == "metro") {
    fill(100)
  } else if (mode == "regional") {
    fill(150)
  } else if (mode == "IC") {
    fill(200)
  } else if (mode == "bus") {
    fill(225)
  }
  rectMode(CORNER)
  rect(start, entryLayout.marginVerticalTrain, stop - start, entryLayout.height - 2 * entryLayout.marginVerticalTrain, 5)
}

const drawTargetTime = (targetTime, timeRange) => {
  const xPos = map(targetTime, timeRange.min, timeRange.max, 0, entryLayout.width)

  stroke(100, 150, 255)
  strokeWeight(5)
  line(xPos, entryLayout.marginVerticalTarget, xPos, entryLayout.height - entryLayout.marginVerticalTarget)
}

function mouseWheel(event) {
  scrollPos -= event.delta;
  scrollPos = constrain(scrollPos, maxScrollPos, 0)
}