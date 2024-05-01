export function UnsafeText(text) {
	let span = document.createElement("span");
	span.textContent = text;
	return span.innerHTML;
}