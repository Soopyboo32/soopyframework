import { Observable } from "./Observable.js";

export const settings = Observable.of({
	components: {
		popup: {
			clickOutsideToClose: true,
			verticalCenter: false,
		}
	}
});