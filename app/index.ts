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
const dateLabel: TextElement = document.getElementById("dateLabel") as TextElement;

// And the clock face arcs
const clockArc: ArcElement = document.getElementById("clockArc") as ArcElement;

const handArcGroup: GroupElement = document.getElementById("handArcGroup") as GroupElement;

const clockTickGroup: GroupElement = document.getElementById("tickContainer") as GroupElement;
const clockTicks: GroupElement[] = clockTickGroup.getElementsByClassName("tick") as GroupElement[];

const halfTickGroup: GroupElement = document.getElementById("halfContainer") as GroupElement;
const halfTicks: GroupElement[] = halfTickGroup.getElementsByTagName("g") as GroupElement[];

if (clockTicks.length !== 24 || halfTicks.length !== 24) {
    console.error(`Error: Clock ticks are not 24 elements (${clockTicks.length}, ${halfTicks.length})`);
}

function updateClockFace() {
    const is24hr = preferences.clockDisplay === "24h";

    for (let i=0; i<24; i++) {
        clockTicks[i].groupTransform.rotate.angle = i * 15;
        halfTicks[i].groupTransform.rotate.angle = i * 15 + 8;

        const textGroup = clockTicks[i].getElementsByClassName("tickText")[0] as GroupElement;
        if (textGroup) {
            textGroup.groupTransform.rotate.angle = i * -15;
            const texts = textGroup.getElementsByTagName("text") as TextElement[];
            texts.forEach(t => t.text = util.hoursToString((i+18) % 24, is24hr));
        }
    }
}

let last24hr: boolean | undefined;
function updateDisplayPref() {
    const is24hr = preferences.clockDisplay === "24h";
    if (is24hr !== last24hr) {
        last24hr = is24hr;
        updateClockFace();
    }
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    updateDisplayPref();

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

    // Update the time.
    const hoursString = util.hoursToString(hours, last24hr);
    const minsString = util.zeroPad(today.getMinutes());
    timeLabel.text = `${hoursString}:${minsString}`;

    // Update the date.
    const monthIndex = today.getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayString = `${today.getDate()}`;
    dateLabel.text = `${monthNames[monthIndex]} ${dayString}`;
}
