import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/util";

// Update the clock every minute
clock.granularity = "minutes";
// clock.granularity = "seconds";

const root: any = document.getElementById("root");

console.log(root.width, root.height);

// Get a handle on the <text> element
const timeLabel = document.getElementById("timeLabel") as TextElement;
const dateLabel = document.getElementById("dateLabel") as TextElement;

// And the clock face arcs
const clockArc = document.getElementById("clockArc") as ArcElement;

const handArcGroup = document.getElementById("handArcGroup") as GroupElement;

const clockTickGroup = document.getElementById("tickContainer") as GroupElement;
const clockTicks = clockTickGroup.getElementsByClassName("tick") as GroupElement[];

const halfTickGroup = document.getElementById("halfContainer") as GroupElement;
const halfTicks = halfTickGroup.getElementsByTagName("g") as GroupElement[];

const clockFaceTranslate = document.getElementById("clockFaceTranslate") as GroupElement;
const clockFaceScale = document.getElementById("clockFaceScale") as GroupElement;

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
            texts.forEach(t => t.text = util.hoursToFaceString((i+18) % 24, is24hr));
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

function updateClockHands(today: Date) {
    const hours = today.getHours() + today.getMinutes() / 60.0;
    // const hours = today.getSeconds() * 24 / 60;

    // Update the clock arc. The whole thing is already rotated 45 degrees,
    // so only add 45 to base it on the bottom.
    let clockAngle = (hours * 360.0 / 24.0) + 12.0 + 180.0;
    clockAngle = util.limitDegrees(clockAngle);

    clockArc.startAngle = clockAngle;

    let handAngle = (hours * 360.0 / 24.0) - 270.0;
    handAngle = util.limitDegrees(handAngle);

    handArcGroup.groupTransform.rotate.angle = handAngle;
}

function updateZoom(today: Date) {
    // const hours = today.getHours();
    const hours = today.getSeconds() * 24 / 60;
    const handAngle = util.limitDegrees((hours * 360.0 / 24.0) + 90.0);
    const angle = handAngle * Math.PI * 2.0 / 360.0;
    const radius = root.width / 2.0;
    const cx = radius * Math.cos(angle);
    const cy = radius * Math.sin(angle);

    // Use a fixed zoom for now, say 1.75x.
    const zoom = 2.5;
    const viewSize = root.width / zoom;

    // We want to position the viewport so it's off to a side,
    // as close to centring the hand arrow as possible, but also not
    // introducing blank space outside the watch face paint area.
    clockFaceScale.groupTransform.scale.x = zoom;
    clockFaceScale.groupTransform.scale.y = zoom;

    const viewRadius = viewSize / 2.0;
    let tx = cx, ty = cy;

    /*if ((tx - viewRadius) < -radius) tx = -viewRadius;
    if ((tx + viewRadius) > radius) tx = viewRadius;
    if ((ty - viewRadius) < -radius) ty = -viewRadius;
    if ((ty + viewRadius) > radius) ty = viewRadius;*/

    const vars = {
        hours, handAngle, angle, radius, cx, cy, zoom, viewSize, tx, ty
    };
    console.log(JSON.stringify(vars, null, 4));

    clockFaceTranslate.groupTransform.translate.x = -tx + radius;
    clockFaceTranslate.groupTransform.translate.y = -ty + radius;
}

function updateTime(today: Date) {
    const hours = today.getHours();

    // Update the time.
    const hoursString = util.hoursToString(hours, last24hr);
    const minsString = util.zeroPad(today.getMinutes());
    let timeText = `${hoursString}:${minsString}`;
    if (!last24hr) {
        if (hours < 12) {
            timeText += 'a';
        } else {
            timeText += 'p';
        }
    }
    timeLabel.text = timeText;

    // Update the date.
    const monthIndex = today.getMonth();
    const dayString = `${today.getDate()}`;
    dateLabel.text = `${util.getMonthName(monthIndex)} ${dayString}`;
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    const today = evt.date;

    updateDisplayPref();
    updateClockHands(today);
    updateTime(today);
    // updateZoom(today);
}
