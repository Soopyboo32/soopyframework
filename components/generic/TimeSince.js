import { html, useRef } from "../../helpers.js";

export default function TimeSince(timestamp) {
	let time = useRef().interval(()=>{
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

	let ret = "";
	if (hours >= 1) ret += Math.floor(hours) + "h ";
	if (minutes >= 1) ret += Math.floor(minutes % 60) + "m ";
	if (seconds >= 1) ret += Math.floor(seconds % 60) + "s";

	return ret;
}