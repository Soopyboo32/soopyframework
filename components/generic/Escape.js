export function Escape(str, specialChars = ["\"", "\\"], escapeChar = "\\") {
	return str.split("").map(c => specialChars.includes(c) ? escapeChar + c : c).join("");
}