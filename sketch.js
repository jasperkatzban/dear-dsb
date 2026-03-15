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
  marginVertical: 50,
  marginVerticalTrain: 25,
  width: canvasProps.width / 2 - 50,
  height: 100,
  morningTimeRange: {
    min: 450,
    max: 570,
  },
  eveningTimeRange: {
    min: 990,
    max: 1110,
  },
  transferTime: 4
}


const testEntryPropsA = {
  date: 10,
  day: "TUE",
  cost: 23.75,
  checkIn: 516,
  checkOut: 536,
  changeTime: 534,
  targetTime: 540,
  mode: "train",
  secondMode: "metro",
}

const testEntryPropsB = {
  date: 10,
  day: "TUE",
  cost: 23.75,
  checkIn: 1040,
  checkOut: 1100,
  targetTime: 1020,
  mode: "train",
  secondMode: "metro",
}

const testDay = { morningEntryProps: testEntryPropsA, eveningEntryProps: testEntryPropsB }

const testDays = [testDay, testDay, testDay, testDay, testDay, testDay, testDay, testDay, testDay, testDay, testDay]

let maxScrollPos = -((testDays.length + 1) * entryLayout.height - canvasProps.height)

function setup() {
  createCanvas(1920, 1080)

  flex({
    canvas: {
      fit: CONTAIN
    }
  })
}

function draw() {
  clear()
  push()
  translate(0, scrollPos)
  drawDays()
  pop()

  drawMask()
}

const drawMask = () => {
  fill(255)
  noStroke()
  rect(0, 0, canvasProps.width, entryLayout.marginVertical)
  rect(0, canvasProps.height - entryLayout.marginVertical, canvasProps.width, entryLayout.marginVertical)
}

const drawDays = () => {
  testDays.forEach((day, i) => {
    const yPos = i * entryLayout.height + entryLayout.marginVertical
    drawDay(yPos, day.morningEntryProps, day.eveningEntryProps)
  });
}

const drawDay = (yPos, morningEntryProps, eveningEntryProps) => {
  drawEntry(entryLayout.marginLeft, yPos, morningEntryProps, "morning")
  drawEntry(canvasProps.center.x, yPos, eveningEntryProps, "evening")
}

const drawEntry = (xPos, yPos, entryProps, mode) => {
  noFill()
  stroke(0)
  strokeWeight(2)
  push()
  translate(xPos, yPos)
  rect(0, 0, entryLayout.width, entryLayout.height)
  drawTimeline(entryProps, mode)
  pop()
  // text(`${day} ${date}`)
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

  drawTargetTime(entryProps.targetTime, timeRange)
}

const drawTrain = (start, stop, mode) => {
  if (mode == "train") {
    fill(100)
  } else if (mode == "metro") {
    fill(200)

  } else if (mode == "regional") {
    fill(50)
  }
  rect(start, entryLayout.marginVerticalTrain, stop - start, entryLayout.height - 2 * entryLayout.marginVerticalTrain)
}

const drawTargetTime = (targetTime, timeRange) => {
  const xPos = map(targetTime, timeRange.min, timeRange.max, 0, entryLayout.width)

  stroke(0)
  strokeWeight(5)
  line(xPos, entryLayout.marginVerticalTrain, xPos, entryLayout.height - entryLayout.marginVerticalTrain)
}

function mouseWheel(event) {
  scrollPos -= event.delta;
  scrollPos = constrain(scrollPos, maxScrollPos, 0)
}