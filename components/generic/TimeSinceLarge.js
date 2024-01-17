import {html, useRef} from "../../helpers.js";

export default function TimeSinceLarge(timestamp) {
    let time = useRef().interval(() => {
        time.renderInner(getTime(timestamp));
    }, 1000);

    return html`<span ${time}>${getTime(timestamp)}</span>`;
}

function getTime(timestamp) {
    let now = Date.now();
    let milliseconds = now - timestamp;
    let seconds = milliseconds / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    let months = days / 30;

    if (months >= 1) return Math.floor(months) + " month" + (Math.floor(months) === 1 ? "" : "s")
    if (days >= 1) return Math.floor(days) + " day" + (Math.floor(days) === 1 ? "" : "s")
    if (hours >= 1) return Math.floor(hours) + " hour" + (Math.floor(hours) === 1 ? "" : "s")
    if (minutes >= 1) return Math.floor(minutes) + " minuite" + (Math.floor(minutes) === 1 ? "" : "s")
    if (seconds >= 1) return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s")
    if (milliseconds >= 1) return Math.floor(milliseconds) + " milisecond" + (Math.floor(milliseconds) === 1 ? "" : "s")
    return "";
}