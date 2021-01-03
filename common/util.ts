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

export function hoursToString(hours: number, is24hr: boolean): string {
    if (!is24hr) {
        // 12h format
        return `${hours % 12 || 12}`;
    } else {
        // 24h format
        return zeroPad(hours);
    }
}
