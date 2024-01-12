import { html, useRef } from "./helpers.js";

/** @type {WeakMap<Proxy, String>} */
let paths = new WeakMap();

/**
 * @template T
 */
export class Observable {
	/**@type {ProxyHandler} */
	#proxyObj;
	#data;
	#cbArr;
	#accessTracking = false;
	/** @type {Set<string>} */
	#accesses = new Set();

	/**
	 * Observe some data for changes
	 * @template T
	 * @param {T} data
	 * @return {Observable<T>}
	 */
	static of(data) {
		return new Observable(data);
	}

	/**
	 * Observe some data for changes
	 * @param data {T}
	 * @private
	 */
	constructor(data) {
		this.#data = data;
		this.#cbArr = new Set();

		this.#proxyObj = {};

		this.#proxyObj.get = (target, p, receiver) => {
			let data = target[p];
			if (typeof p === "symbol") {
				p = "[symbol]";
			}

			let oldPath = paths.get(receiver);
			let newPath = oldPath ? oldPath + "." + p : p;
			if (this.#accessTracking) {
				this.#accesses.add(newPath);
			}

			if (typeof data === "object" && !data._observableIgnore) {
				let ret = new Proxy(data, this.#proxyObj);
				paths.set(ret, newPath);
				return ret;
			}

			return data;
		};

		this.#proxyObj.set = (target, p, newVal, receiver) => {
			target[p] = newVal;
			if (typeof p === "symbol") {
				p = "[symbol]";
			}

			let thisPath = paths.get(receiver);
			let fullPath = thisPath ? thisPath + "." + p : p;
			this.changed(fullPath);
			return true;
		};
	}

	/**
	 * @param val {T}
	 */
	set data(val) {
		this.#data = val;

		this.changed("");
	}

	/**
	 * @param val {T}
	 */
	set(val) {
		this.data = val;
	}

	/**
	 * @returns {T}
	 */
	get data() {
		if (this.#accessTracking) {
			this.#accesses.add("");
		}

		if (typeof this.#data !== "object" || this.#data._observableIgnore) {
			return this.#data;
		}

		return new Proxy(this.#data, this.#proxyObj);
	}

	/**
	 * @returns {T}
	 */
	get() {
		return this.data;
	}

	changed(path) {
		let data = this.data;
		for (let cb of this.#cbArr) {
			cb(path, data);
		}
	}

	/**
	 *
	 * @param {(path: String, data: any) => any} cb
	 * @returns
	 */
	onChange(cb) {
		this.#cbArr.add(cb);

		return () => {
			this.#cbArr.delete(cb);
		};
	}

	/**
	 * Will update the HTML live when this observable changes
	 * @param {()=>HTML} fn
	 * @returns {HTML}
	 */
	observe(fn) {
		this.pushAccessTracking();
		let contents = fn();
		let accesses = this.popAccessTracking();
		//TODO: make this a debug function like Observable.debug() or smth
		// console.log(accesses);

		let ref = useRef().onRemove(this.onChange((path) => {
			if (!accesses.has(path)) return;

			this.pushAccessTracking();
			ref.renderInner(fn());
			accesses = this.popAccessTracking();
			// console.log(accesses);
		}));

		return html`<span ${ref} data-1="observing">${contents}</span>`;
	}

	pushAccessTracking() {
		this.#accessTracking = true;
	}

	popAccessTracking() {
		this.#accessTracking = false;
		let ret = this.#accesses;
		this.#accesses = new Set();
		return ret;
	}
}