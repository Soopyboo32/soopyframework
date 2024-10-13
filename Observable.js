import { html, useRef } from "./helpers.js";

/** @type {WeakMap<Proxy, String>} */
let paths = new WeakMap();

/**
 * @template T
 * @class
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
	 * @template T
	 * @param {T} observable
	 * @returns {T extends Observable<any> ? true : false}
	 */
	static is(observable) {
		return observable instanceof Observable;
	}

	/**
	 * @param {...Observable<any>} observables
	 * @returns {Observable<any[]>}
	 */
	static join(...observables) {
		let newO = Observable.of(observables.map(o => o.data));

		observables.forEach((o, i) => {
			o.onChange(path => {
				newO.data[i] = o.data;
			});
		});

		return newO;
	};

	/**
	 * @template T
	 * @param {Observable<T> | T} data
	 * @returns {Observable<T>}
	 */
	static wrap(data) {
		if (Observable.is(data)) return data;
		return Observable.of(data);
	}

	/**
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

			if (p === "__isProxy") {
				return true;
			}
			if (p === "__proxyTarget") {
				return target;
			}

			let oldPath = paths.get(receiver);
			let newPath = oldPath ? oldPath + "." + p : p;
			if (this.#accessTracking) {
				this.#accesses.add(newPath);
			}

			if (data && typeof data === "object" && !data._observableIgnore) {
				let ret = new Proxy(data, this.#proxyObj);
				paths.set(ret, newPath);
				return ret;
			}

			return data;
		};

		this.#proxyObj.set = (target, p, newVal, receiver) => {
			if (newVal?.__isProxy) {
				newVal = newVal.__proxyTarget;
			}

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
	 */
	onChange(cb) {
		this.#cbArr.add(cb);

		return () => {
			this.#cbArr.delete(cb);
		};
	}

	/**
	 * Will update the HTML live when this observable changes
	 * @param {()=>any} fn
	 * @returns {HTML}
	 */
	observe(fn) {
		this.pushAccessTracking();
		let contents = fn();
		let accesses = this.popAccessTracking();
		//TODO: make this a debug function like Observable.debug() or smth
		// console.log(accesses);

		let ref = useRef().onRemove(this.onChange(path => {
			if (!accesses.has(path)) return;

			accesses.clear();
			setTimeout(() => { //prevent multiple re-renders in 1 update if its setting multiple things
				this.pushAccessTracking();
				ref.renderInner(fn());
				accesses = this.popAccessTracking();
				// console.log(accesses);
			}, 0);
		}));

		return html`<span ${ref}>${contents}</span>`;
	}

	/**
	 * @template U
	 * @template {T} T
	 * @param {(data: T) => U} fn
	 * @returns {Observable<U>}
	 */
	map(fn) {
		this.pushAccessTracking();
		let newO = Observable.of(fn(this.data));
		let accesses = this.popAccessTracking();

		this.onChange(path => {
			if (!accesses.has(path)) return;

			this.pushAccessTracking();
			let newData = fn(this.data);
			accesses = this.popAccessTracking();
			if (deepEquals(newO.data, newData)) return;
			newO.data = newData;
		});

		return newO;
	}

	effect(fn) {
		fn(this.data);
		this.onChange(path => {
			fn(this.data);
		});
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
};

function deepEquals(obj1, obj2) {
	if (obj1 === obj2) return true;
	if (typeof obj1 !== typeof obj2 || typeof obj1 !== "object") return false;

	if (Array.isArray(obj1)) {
		if (obj1.length !== obj2.length) return false;
		for (let i = 0; i < obj1.length; i++) {
			if (!deepEquals(obj1[i], obj2[i])) return false;
		}
		return true;
	}

	for (let key in obj1) {
		if (!deepEquals(obj1[key], obj2[key])) return false;
	}

	return true;
}