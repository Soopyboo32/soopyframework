import { html, useRef } from "../../helpers.js";

export const TimeDisplayMode = {
	TINY: "tiny",
	SMALL: "small",
	LARGE: "large",
};

export function TimeSince(timestamp, displayMode = TimeDisplayMode.SMALL) {
	let text = getTimeFns[displayMode](Date.now() - timestamp);

	let time = useRef().interval(() => {
		let newText = getTimeFns[displayMode](Date.now() - timestamp);
		if (newText !== text) {
			text = newText;
			time.renderInner(text);
		}
	}, 1000);

	return html.withRef(time)`<span ${time}>${text}</span>`;
}

export function TimeTill(timestamp, displayMode = TimeDisplayMode.SMALL) {
	let text = getTimeFns[displayMode](timestamp - Date.now());

	let time = useRef().interval(() => {
		let newText = getTimeFns[displayMode](timestamp - Date.now());
		if (newText !== text) {
			text = newText;
			time.renderInner(text);
		}
	}, 1000);

	return html.withRef(time)`<span ${time}>${text}</span>`;
}

let getTimeFns = {
	[TimeDisplayMode.TINY]: (milliseconds) => {
		let seconds = milliseconds / 1000;
		let minutes = seconds / 60;
		let hours = minutes / 60;
		let days = hours / 24;

		if (days >= 1) return Math.floor(days) + "d";
		if (hours >= 1) return Math.floor(hours) + "h";
		if (minutes >= 1) return Math.floor(minutes % 60) + "m";
		if (seconds >= 1) return Math.floor(seconds % 60) + "s";

		return "0s";
	},
	[TimeDisplayMode.SMALL]: (milliseconds) => {
		let seconds = milliseconds / 1000;
		let minutes = seconds / 60;
		let hours = minutes / 60;
		let days = hours / 24;

		let ret = "";
		if (days >= 1) ret += Math.floor(days) + "d ";
		if (hours >= 1) ret += Math.floor(hours) + "h ";
		if (minutes >= 1) ret += Math.floor(minutes % 60) + "m ";
		if (seconds >= 1) ret += Math.floor(seconds % 60) + "s";

		return ret.trim();
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
	},
};
