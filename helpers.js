/**
 * @typedef {Object} Reference
 * @property {(callback: (this: HTMLElement, ev: MouseEvent) => any) => Reference} onClick
 * @property {(callback: (this: HTMLElement, ev: MouseEvent) => any) => Reference} onMouseDown
 * @property {(callback: () => any) => Reference} onEnterKey
 * @property {(callback: (MouseEvent) => any) => Reference} onHoverEnter
 * @property {(callback: (MouseEvent) => any) => Reference} onHoverMove
 * @property {(callback: (MouseEvent) => any) => Reference} onHoverExit
 * @property {(callback: (Event) => any) => Reference} onChange
 * @property {(callback: (KeyboardEvent) => any) => Reference} onKeyUp
 * @property {(callback: (KeyboardEvent) => any) => Reference} onKeyDown
 * @property {(data: HTML | string) => Reference} reRender
 * @property {(data: HTML | string) => Reference} renderInner
 * @property {(...any[]) => Reference} css
 * @property {(css: StaticCss) => Reference} toggleClass
 * @property {(css: StaticCss) => Reference} setClass
 * @property {(callback: () => any, timeout: number) => Reference} interval
 * @property {(callback: () => any, timeout?: number) => Reference} timeout
 * @property {() => void} remove
 * @property {() => boolean} exists
 * @property {() => string} getId
 * @property {() => HTMLElement | null} getElm
 * @property {(callback: () => any) => Reference} onRemove
 * @property {(observer: IntersectionObserver) => Reference} observe
 * @property {true} _isHtml
 */

/**
 * @typedef {string} HTML
 */
/**
 * @typedef {Object} _HTML_PROPS
 * @property {() => Reference|undefined} getRef
 * @property {true} _isHtml
 */
/**
 * @typedef {HTML & _HTML_PROPS} HTML_EXTENDED
 */

import { UnsafeText } from "./components/generic/UnsafeText.js";

/**
 * @returns {Reference}
 */
export function useRef() {
	let id = "r_" + generateId();

	let removeCb = [];
	let intervals = [];
	let timeouts = [];

	/**
	 * @type {Reference}
	 */
	let ref = {
		toString: () => `id="${id}"`,
		getId: () => id,
		onClick: (callback) => {
			onEventRaw(ref, "click", callback);
			return ref;
		},
		onMouseDown: (callback) => {
			onEventRaw(ref, "mousedown", callback);
			return ref;
		},
		onEnterKey: (callback) => {
			onEventRaw(ref, "keyup", (key) => {
				if (key.key === "Enter") {
					callback();
				}
			});
			return ref;
		},
		onHoverEnter: (callback) => {
			onEventRaw(ref, "mouseover", callback);
			return ref;
		},
		onHoverMove: (callback) => {
			onEventRaw(ref, "mousemove", callback);
			return ref;
		},
		onHoverExit: (callback) => {
			onEventRaw(ref, "mouseout", callback);
			return ref;
		},
		onChange: (callback) => {
			onEventRaw(ref, "change", callback);
			return ref;
		},
		onKeyDown: (callback) => {
			onEventRaw(ref, "keydown", callback);
			return ref;
		},
		onKeyUp: (callback) => {
			onEventRaw(ref, "keyup", callback);
			return ref;
		},
		reRender: (data) => {
			let elm = ref.getElm();
			if (!elm) return ref;
			elm.outerHTML = data;
			return ref;
		},
		renderInner: (data) => {
			let elm = ref.getElm();
			if (!elm) return ref;
			elm.innerHTML = data;
			return ref;
		},
		exists: () => {
			let elm = ref.getElm();
			return !!elm;
		},
		getElm: () => document.getElementById(id),
		onRemove: (callback) => {
			if (!removeCb.length) {
				let interval = setInterval(() => {
					if (ref.exists()) {
						return;
					}

					clearInterval(interval);
					for (let cb of removeCb) {
						cb();
					}
				}, 1000);

			}
			removeCb.push(callback);
			return ref;
		},
		css: (...args) => {
			let elm = ref.getElm();
			if (!elm) return ref;

			if (args[0]._classType === "StaticCss") {
				ref.getElm().className = args[0].getAllClasses().join(" ");
				return ref;
			}

			elm.style = toCssString(args);

			return ref;
		},
		toggleClass: (css) => {
			let elm = ref.getElm();
			if (!elm) return;

			css.getAllClasses().forEach(c => {
				elm.classList.toggle(c);
			});

			return this;
		},
		setClass: (css) => {
			let elm = ref.getElm();
			if (!elm) return;

			elm.className = css.getAllClasses().join(" ");

			return this;
		},
		interval: (callback, timeout) => {
			if (!intervals.length) {
				ref.onRemove(() => {
					for (let id of intervals) {
						clearInterval(id);
					}
				});
			}

			intervals.push(setInterval(() => {
				if (!ref.exists()) return;
				callback();
			}, timeout));
			return ref;
		},
		timeout: (callback, timeout = 0) => {
			if (!timeouts.length) {
				ref.onRemove(() => {
					for (let id of timeouts) {
						clearTimeout(id);
					}
				});
			}

			timeouts.push(setTimeout(() => {
				if (!ref.exists()) return;
				callback();
			}, timeout));
			return ref;
		},
		observe: (observer) => {
			setTimeout(() => ref.exists() && observer.observe(ref.getElm()));
			return ref;
		},
		remove: () => {
			if (!ref.exists()) return;
			ref.getElm().remove();
		},
		_isHtml: true,
		_classType: "Reference"
	};

	return ref;
}

/**
 * @param {Reference} ref
 * @param {(elm: HTMLElement) => void} cb
 */
function withElm(ref, cb) {
	let elm = ref.getElm();
	if (elm) {
		cb(elm);
		return;
	}

	setTimeout(() => {
		let elm = ref.getElm();
		if (!elm) return;
		cb(elm);
	});
}

/**
 * @param ref {Reference}
 * @param event
 * @param callback
 */
function onEventRaw(ref, event, callback) {
	withElm(ref, elm => {
		elm.addEventListener(event, (...args) => {
			callback(...args);
		});
	});
}

/**
 * @returns {String}
 */
function templateToString(asd) {
	let strVal = "";
	asd[0].forEach((s, i) => {
		strVal += s + (asd[i + 1] || "");
	});
	return strVal;
}

/**
 * @returns {HTML_EXTENDED}
 */
function toHtmlString(asd) {
	let strVal = asd[0].map((s, i) => s + varToHtmlStr(asd[i + 1] ?? "")).join("");

	let html = {
		toString: () => strVal,
		_ref: undefined,
		_isHtml: true,
		getRef: () => html._ref
	};

	return html;
}

function varToHtmlStr(asd) {
	if (Array.isArray(asd)) {
		return Join(asd);
	}

	if (asd && !asd._isHtml) {
		return UnsafeText(asd.toString());
	}

	return asd;
}

/**
 * @param {HTML[]} arr
 * @param {HTML} joiner
 */
export function Join(arr, joiner = "") {
	let joinerStr = varToHtmlStr(joiner);

	let data = arr.map(varToHtmlStr).join(joinerStr ?? "");

	let html = {
		toString: () => data,
		_ref: undefined,
		_isHtml: true,
		getRef: () => html._ref
	};

	return html;
}

/**
 * Atm this works the exact same as a template literal without the html call
 * Maybe I do something with this in the future tho, + it helps syntax detection for editors
 * @returns HTML_EXTENDED
 */
export function html(...args) {
	return toHtmlString(args);
}

/**
 * @param ref
 * @returns {(...any) => HTML_EXTENDED}
 */
html.withRef = function (ref) {
	return (...args) => {
		let ret = toHtmlString(args);
		ret._ref = ref;
		return ret;
	};
};

/**
 * @returns {HTML_EXTENDED}
 */
html.unsafe = (...args) => {
	let str;
	if (typeof args[0] === "string") str = args[0];
	else str = templateToString(args);

	let html = {
		toString: () => str,
		_ref: undefined,
		_isHtml: true,
		getRef: () => html._ref
	};

	return html;
};

/**
 * @typedef {()=>Css} Css
 */

export function css(...args) {
	let str = toCssString(args);

	return fromCssString(str);
}

function toCssString(asd) {
	let css = "";
	asd[0].forEach((s, i) => {
		if ((typeof asd[i + 1] == "object" || typeof asd[i + 1] == "function")
			&& (asd[i + 1]._classType === "DynamicCss")) {
			css += s + asd[i + 1].getRawCss();
		} else {
			css += s + (asd[i + 1] || "");
		}
	});
	return css;
}

function fromCssString(str) {
	let val = str;

	/**@type {Css} */
	let ret = (...args2) => {
		let css = toCssString(args2);

		return fromCssString(val + css);
	};
	ret.toString = () => `style="${val.replaceAll("\"", "\\\"").replaceAll(/[\n\t]/g, "").replaceAll(/;;+/g, ";")}"`;
	ret.getRawCss = () => val;
	ret._classType = "DynamicCss";
	ret._isHtml = true;

	return ret;
}

/**
 * @typedef {()=>StaticCss} _StaticCss
 *
 * @typedef {Object} _CssProps
 * @property {() => string} getCss
 * @property {() => StaticCss} css
 * @property {() => string} getClassName
 * @property {() => string[]} getAllClasses
 * @property {(StaticCss) => StaticCss} merge
 * @property {(string) => StaticCss} mergeNamed
 * @property {(string) => StaticCss} named
 * @property {true} _isHtml
 *
 * @typedef {_StaticCss & _CssProps} StaticCss
 */

export function staticCss(...args) {
	let data = toStaticCssData(args);

	return fromStaticCssData(data, [generateClassName()]);
}

staticCss.named = (id) => {
	return fromStaticCssData([], [], id);
};

staticCss.css = (...args) => {
	let data = toStaticCssData(args);

	return fromStaticCssData(data, [generateClassName()]);
};

function toStaticCssData(asd) {
	let css = [];
	asd[0].forEach((s, i) => {
		css.push(s);
		if ((typeof asd[i + 1] == "object" || typeof asd[i + 1] == "function")
			&& (
				asd[i + 1].internal_isCssClassGetter === true
				|| asd[i + 1].internal_isCssClassUUIDGetter === true
				|| asd[i + 1].internal_isCssClassAnimGetter === true
				|| asd[i + 1]._classType === "StaticCss"
				|| asd[i + 1]._classType === "Reference"
			)) {
			css.push(asd[i + 1]);
		} else if (asd[i + 1]) {
			css.push(asd[i + 1] + "");
		}
	});
	if (css[0].startsWith("{") && css[css.length - 1].endsWith("}")) {
		css[0] = css[0].substring(1, css[0].length);
		css[css.length - 1] = css[css.length - 1].substring(0, css[css.length - 1].length - 1);
	}
	return css;
}

function fromStaticCssData(data, classes = [], nextName) {
	classes = [...new Set(classes)];
	let val = data;

	/**@type {StaticCss} */
	let ret = (...args2) => {
		let css = toStaticCssData(args2);

		let className = generateClassName(nextName);
		return fromStaticCssData(css, [...classes, className]);
	};
	ret.css = (...args2) => {
		let css = toStaticCssData(args2);

		let className = generateClassName(nextName);
		return fromStaticCssData(css, [...classes, className]);
	};
	ret.merge = (otherCss) => {
		return fromStaticCssData([], [...classes, ...otherCss.getAllClasses(), ""]);
	};
	ret.mergeNamed = (otherCss) => {
		return fromStaticCssData([], [...classes, otherCss, ""]);
	};
	ret.named = (id) => {
		nextName = id;
		return ret;
	};
	ret.getCss = () => val.map(d => {
		if (d.internal_isCssClassGetter) return `.${classes[classes.length - 1]}`;
		if (d.internal_isCssClassUUIDGetter) return `${classes[classes.length - 1]}`;
		if (d.internal_isCssClassAnimGetter) return `anim--${classes[classes.length - 1]}--${d.animId}`;
		if (d._classType === "StaticCss") return `.${d.getClassName()}`;
		if (d._classType === "Reference") return `#${d.getId()}`;

		return d;
	}).join("");
	ret.getClassName = () => classes[classes.length - 1];
	ret.getAllClasses = () => classes;
	ret.toString = () => {
		return `class="${classes.join(" ")}"`;
	};
	ret._classType = "StaticCss";
	ret._isHtml = true;

	addCssToFile(ret);

	return ret;
}

export let thisClass = {
	internal_isCssClassGetter: true,
	uuid: {
		internal_isCssClassUUIDGetter: true,
	},
	animation: (id) => ({
		internal_isCssClassAnimGetter: true,
		animId: id
	})
};

let generatedIds = new Set([""]);

function generateClassName(id = "") {
	let testId = id;
	while (generatedIds.has(testId)) {
		testId = id + "_" + Math.floor(Math.random() * 2400000).toString(16);
	}
	generatedIds.add(testId);
	return testId;
}

export function generateId() {
	return Math.floor(Math.random() * 2400000).toString(16);
}

let styleElm = document.getElementById("css");
let cssAdded = new Set([]);

/**
 * @param {StaticCss} staticCss
 */
function addCssToFile(staticCss) {
	if (cssAdded.has(staticCss.getClassName())) {
		return;
	}
	cssAdded.add(staticCss.getClassName());

	styleElm.innerHTML += staticCss.getCss() + "\n";
}

/**
 * @param {number} x
 */
export function numberWithCommas(x) {
	if (x === undefined) return "";
	let parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

export function deepClone(obj) {
	if (Array.isArray(obj)) {
		return obj.map(deepClone);
	}

	if (typeof obj === "object") {
		return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepClone(v)]));
	}

	return obj;
}