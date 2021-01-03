// Add zero in front of numbers < 10
export function zeroPad(i: number): string {
    if (i < 10) {
        return "0" + i;
    } else {
        return "" + i;
    }
}
  
export function limit(value: number, lim: number): number {
    let i = value;
    while (i < 0) {
        i += lim;
    }

    i = Math.round(i);
    return i % lim;
}

export function limitDegrees(value: number): number {
    return limit(value, 360);
}

export function hoursToFaceString(hours: number, is24hr: boolean): string {
    if (!is24hr) {
        const hourString =`${Math.floor(hours % 12 || 12)}`;
        const evening = hours >= 12 ? 'p' : 'a';
        return `${hourString}${evening}`;
    } else {
        return zeroPad(hours);
    }
}

export function hoursToString(hours: number, is24hr: boolean): string {
    if (!is24hr) {
        return `${Math.floor(hours) % 12 || 12}`;
    } else {
        return zeroPad(hours);
    }
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function getMonthName(monthIndex: number): string {
    return monthNames[monthIndex];
}
