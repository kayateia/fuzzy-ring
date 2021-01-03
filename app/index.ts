import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/util";

// Update the clock every minute
// clock.granularity = "minutes";
clock.granularity = "seconds";

const root: any = document.getElementById("root");

console.log(root.width, root.height);

const clockFace: GroupElement = document.getElementById("clockFace") as GroupElement;

// Get a handle on the <text> element
const timeLabel: TextElement = document.getElementById("timeLabel") as TextElement;

// And the clock face arcs
const clockArc: ArcElement = document.getElementById("clockArc") as ArcElement;

const handArcGroup: GroupElement = document.getElementById("handArcGroup") as GroupElement;

const clockTickGroup: GroupElement = document.getElementById("tickContainer") as GroupElement;
const clockTicks: GroupElement[] = clockTickGroup.getElementsByTagName("g") as GroupElement[];

const halfTickGroup: GroupElement = document.getElementById("halfContainer") as GroupElement;
const halfTicks: GroupElement[] = halfTickGroup.getElementsByTagName("g") as GroupElement[];

if (clockTicks.length !== 24 || halfTicks.length !== 24) {
    console.error(`Error: Clock ticks are not 24 elements (${clockTicks.length}, ${halfTicks.length})`);
}

for (let i=0; i<24; i++) {
    clockTicks[i].groupTransform.rotate.angle = i * 15;
    halfTicks[i].groupTransform.rotate.angle = i * 15 + 8;
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    const today = evt.date;
    // const hours = today.getHours();
    const hours = today.getSeconds() * 24 / 60;

    // Update the clock arc. The whole thing is already rotated 45 degrees,
    // so only add 45 to base it on the bottom.
    let clockAngle = (hours * 360.0 / 24.0) + 12.0 + 180.0;
    clockAngle = util.limitDegrees(clockAngle);

    clockArc.startAngle = clockAngle;

    let handAngle = (hours * 360.0 / 24.0) - 270.0;
    handAngle = util.limitDegrees(handAngle);

    handArcGroup.groupTransform.rotate.angle = handAngle;

    console.log(`arc ${clockArc.startAngle} to ${clockArc.sweepAngle}`);

    // Update the time.
    let hoursString: string;
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hoursString = "" + (hours % 12 || 12);
    } else {
        // 24h format
        hoursString = util.zeroPad(hours);
    }
    let mins = util.zeroPad(today.getMinutes());
    timeLabel.text = `${hours}:${mins}`;
}

// console.log('Hello world!');
