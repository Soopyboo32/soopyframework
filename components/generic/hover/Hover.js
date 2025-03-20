import { staticCss, thisClass } from "../../../helpers.js";

let startColor = "#25025C";
let endColor = "#180134";

//TODO: better border
let wrapperCss = staticCss.named("hover-wrapper").css`${thisClass} {
    border: 1px solid #120313;
    position: fixed;
    border-radius: 3px;
    background: linear-gradient(to bottom, ${startColor}, ${endColor});
    padding: 2px;
    width: max-content;
    height: max-content;
    z-index: 2;
}`;

let internalCss = staticCss.named("hover-inner").css`${thisClass} {
    padding: 4px;
    background: #120313;
    width: fit-content;
    max-width: inherit;
}`;

/**
 * @param ref {Reference}
 * @param elm {() => HTML | undefined}
 * @param options {{shouldApply: (elm: EventTarget) => boolean}}
 */
export function Hover(ref, elm, {shouldApply = () => true} = {}) {
	let wrapper = document.createElement("div");
	wrapper.className = wrapperCss.getAllClasses().join(" ");
	let wrapperInner = document.createElement("div");
	wrapperInner.className = internalCss.getAllClasses().join(" ");
	wrapper.appendChild(wrapperInner);

	let onScreen = false;

	ref.onHoverEnter((e) => {
		if (onScreen) return;
		if (!shouldApply(e.relatedTarget)) return;
		let data = elm();
		if (!data) return;
		document.body.appendChild(wrapper);
		onScreen = true;
		wrapperInner.innerHTML = data;
		position(wrapper, wrapperInner, e);
	});

	ref.onHoverMove((e) => {
		if (!onScreen) return;
		position(wrapper, wrapperInner, e);
	});

	ref.onHoverExit((e) => {
		if (!onScreen) return;
		wrapperInner.innerHTML = "";
		document.body.removeChild(wrapper);
		onScreen = false;
	});

	ref.onRemove(() => {
		if (!onScreen) return;
		wrapper.remove();
		wrapper = undefined;
	});
}

/**
 * @param wrapper {HTMLDivElement}
 * @param e {MouseEvent}
 */
function position(wrapper, wrapperInner, e) {
	let x = e.x + 20;
	let y = e.y - 30;
	let right = false;
	let bottom = false;
	let maxWidth = Math.max(window.innerWidth - x, x) - 35;

	if (x + Math.min(wrapper.offsetWidth, maxWidth) > window.innerWidth) {
		x = window.innerWidth - e.x + 20;
		right = true;
	}
	if (y > window.innerHeight - wrapper.offsetHeight) {
		y = window.innerHeight - e.y - 20 - wrapper.offsetHeight;
		bottom = true;
	}
	if (wrapper.offsetHeight > window.innerHeight) {
		y = 0;
		bottom = false;
	}

	if (x < 2) x = 2;
	if (y < 2) y = 2;

	wrapper.style.left = "";
	wrapper.style.right = "";
	wrapper.style.top = "";
	wrapper.style.bottom = "";

	if (right) wrapper.style.right = x + "px";
	else wrapper.style.left = x + "px";
	if (bottom) wrapper.style.bottom = y + "px";
	else wrapper.style.top = y + "px";

	wrapperInner.style.maxWidth = maxWidth + "px";
}
