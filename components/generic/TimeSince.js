import { html, useRef } from "../../helpers.js";

export const TimeDisplayMode = {
	SMALL: "small",
	LARGE: "large"
};

export function TimeSince(timestamp, displayMode = TimeDisplayMode.SMALL) {
	let time = useRef().interval(() => {
		time.renderInner(getTimeFns[displayMode](Date.now() - timestamp));
	}, 1000);

	return html.withRef(time)`<span ${time}>${getTimeFns[displayMode](Date.now() - timestamp)}</span>`;
}

export function TimeTill(timestamp, displayMode = TimeDisplayMode.SMALL) {
	let time = useRef().interval(() => {
		time.renderInner(getTimeFns[displayMode](timestamp - Date.now()));
	}, 1000);

	return html.withRef(time)`<span ${time}>${getTimeFns[displayMode](timestamp - Date.now())}</span>`;
}

let getTimeFns = {
	[TimeDisplayMode.SMALL]: (milliseconds) => {
		let seconds = milliseconds / 1000;
		let minutes = seconds / 60;
		let hours = minutes / 60;

		let ret = "";
		if (hours >= 1) ret += Math.floor(hours) + "h ";
		if (minutes >= 1) ret += Math.floor(minutes % 60) + "m ";
		if (seconds >= 1) ret += Math.floor(seconds % 60) + "s";

		return ret;
	},
	[TimeDisplayMode.LARGE]: (milliseconds) => {
		let seconds = milliseconds / 1000;
		let minutes = seconds / 60;
		let hours = minutes / 60;
		let days = hours / 24;
		let months = days / 30;

		if (months >= 1) return Math.floor(months) + " month" + (Math.floor(months) === 1 ? "" : "s");
		if (days >= 1) return Math.floor(days) + " day" + (Math.floor(days) === 1 ? "" : "s");
		if (hours >= 1) return Math.floor(hours) + " hour" + (Math.floor(hours) === 1 ? "" : "s");
		if (minutes >= 1) return Math.floor(minutes) + " minute" + (Math.floor(minutes) === 1 ? "" : "s");
		if (seconds >= 1) return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s");
		if (milliseconds >= 1) return Math.floor(milliseconds) + " millisecond" + (Math.floor(milliseconds) === 1 ? "" : "s");
		return "";
	}
};
