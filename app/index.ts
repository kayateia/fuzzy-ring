import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/util";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const timeLabel = document.getElementById("timeLabel");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    const today = evt.date;
    const hours = today.getHours();
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
