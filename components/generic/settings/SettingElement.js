import { css, html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors, getBg } from "../../../css.js";
import { Hover } from "../hover/Hover.js";

let settingElmCss = staticCss.named("setting-element").css`${thisClass} {
	position: relative;
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: space-between;
	background-color: transparent;
}`;

let hoverShadowCss = staticCss.named("hover-shadow").css`{
	${thisClass} {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		transition: 0.5s;
		filter: blur(10px);
	}

	${settingElmCss}:hover > ${thisClass} {
		background-color: ${getBg(2)};
	}
}`;

let labelCss = staticCss.named("label").css`${thisClass} {
	z-index: 1;
}`;

let elementCss = staticCss.named("element").css`${thisClass} {
	z-index: 1;
}`;

export function SettingElement(label, element, {observe, shouldShow, loreFn} = {}) {
	let wrapperElmRef = useRef();
	let show = true;

	if (observe && shouldShow) {
		observe.pushAccessTracking();
		show = shouldShow();
		let accesses = observe.popAccessTracking();

		wrapperElmRef.onRemove(observe.onChange(path => {
			if (!accesses.has(path)) return;

			observe.pushAccessTracking();
			show = shouldShow();
			accesses = observe.popAccessTracking();

			wrapperElmRef.css`
				display: ${show ? "flex" : "none"};
			`;
		}));
	}

	if (loreFn) {
		Hover(wrapperElmRef, loreFn);
	}


	return html`
		<div ${settingElmCss} ${wrapperElmRef} ${css`
			display: ${show ? "flex" : "none"};
		`}>
			<div ${hoverShadowCss}></div>
			<div ${labelCss}>${label}</div>
			<div ${elementCss}>${element}</div>
		</div>
	`;
}