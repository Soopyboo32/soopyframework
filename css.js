import { staticCss, thisClass } from "./helpers.js";

export let colors = {
	text: "rgb(229, 231, 235)",
	//background_light: "rgb(32, 37, 59)",
	primary: "rgb(192, 132, 252)",
	primary_dark: "hsl(271 57% 56%)",
	//primary_dark: "rgb(147, 51, 234)", not desaturated
	primary_dark_hover: "#6C2BB0",
	grey: "rgb(55, 65, 81)",
	error: "#CF6679",
	gold: "#FFAA00"
};

export function getBg(height = 0) {
	return `hsl(229 25% ${9 + height * 3}%)`;
}

//TODO: should this have a class?
staticCss`{
	[data-height] {
		background-color: ${getBg(0)};
	}
	${Array.from(Array(10)).map((_, i) => `
		[data-height="${i}"] {
			background-color: ${getBg(i)};
		}
	`).join("")}
	
	body {
		color: ${colors.text}
	}
	
	a {
		color: ${colors.primary}
	}
	
	.chosen-container {
		background-color: ${getBg(3)} !important;
		border: 1px solid ${colors.primary} !important;
		background-image: none !important;
	}
	
	.chosen-container > .chosen-choices {
		background-color: ${getBg(3)} !important;
		background-image: none !important;
		color: ${colors.text} !important;
	}
	
	.chosen-container > .chosen-choices > .search-choice {
		background-color: ${getBg(4)} !important;
		border: 1px solid ${colors.primary} !important;
		background-image: none !important;
	}
	
	.chosen-container > .chosen-drop > .chosen-results {
		background-color: ${getBg(3)} !important;
		background-image: none !important;
		color: ${colors.text} !important;
	}
	
	.chosen-container > .chosen-drop > .chosen-results > .result-selected {
		color: ${colors.grey} !important;
	}
	
	.chosen-container > .chosen-drop > .chosen-results > .active-result {
		color: ${colors.primary} !important;
	}
	
	.chosen-container-multi .chosen-choices li.search-choice {
		color: ${colors.text} !important;
	}
	
	.chosen-container-active .chosen-choices li.search-field .chosen-search-input[type="text"] {
		color: ${colors.text} !important;
	}
}`;

export let buttonCss = staticCss.named("button").css`{
    ${thisClass} {
        display: flex;
        align-items: center;
        height: 26px;
        width: max-content;
        margin: 10px;
        text-align: center;
        background-color: ${colors.primary_dark};
        color: ${colors.text};
        border: 1px solid transparent;
        border-radius: 5px;
        transition: 0.15s;
        transition-timing-function: ease-in;
        padding-block: 1px; /* yoinked these 2 from button css in chrome */
        padding-inline: 6px; /* yoinked these 2 from button css in chrome */
    }

    ${thisClass} > a {
        color: ${colors.text}; /* remove link color from <a> tags */
        text-decoration: none; /* remove underline from <a> tags */
    }

    ${thisClass}:hover:not([disabled]) {
        background-color: ${colors.primary_dark_hover};
        cursor: pointer;
    }

    ${thisClass}:disabled {
        background-color: ${colors.grey};
    }
}`;

export let inlineButtonCss = buttonCss.named("inline-button").css`${thisClass} {
    display: inline-block;
}`;

export let textboxCss = staticCss.named("textbox").css`{
    ${thisClass} {
        height: 26px;
        margin: 10px;
        border: 1px solid transparent;
        border-radius: 5px;
        background-color: ${colors.primary_dark};
        color: ${colors.text};
        padding-left: 10px;
        transition: 0.15s;
        transition-timing-function: ease-in;
        outline: none;
    }

    ${thisClass}::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: ${colors.primary};
        opacity: 1; /* Firefox */
    }

    ${thisClass}:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: ${colors.primary};
    }

    ${thisClass}::-ms-input-placeholder { /* Microsoft Edge */
        color: ${colors.primary};
    }

    ${thisClass}:focus {
        background: ${getBg(0)};
        border: 1px solid ${colors.primary_dark};
    }
}`;

export let invisibleCss = staticCss.named("invisible").css`${thisClass} {
    opacity: 0;
}`;

export let dropdownCss = staticCss.named("dropdown").css`{
    ${thisClass} {
        height: 23px;
        margin: 10px;
        border: 1px solid transparent;
        border-radius: 5px;
        background-color: ${colors.primary_dark};
        color: ${colors.text};
        outline: none;
    }

    /*TODO: fix*/

    ${thisClass} > option:hover {
        background-color: ${colors.primary};
    }
}`;

export let checkboxCss = staticCss.named("checkbox").css`{
    ${thisClass} {
        -webkit-appearance: none;
        appearance: none;
        /*background-color: #fff;*/
        color: ${colors.primary};
        width: 1.5em;
        height: 1.5em;
        border: 0.15em solid currentColor;
        border-radius: 5px;
        display: inline-flex;
        justify-content: space-evenly;
        align-items: center;
        transition: 0.1s;
    }

    ${thisClass}:checked {
        background-color: ${colors.primary};
    }

    ${thisClass}:checked::after {
        color: white;
        font-size: 1.3em;
        content: "✔";
        transform: translateY(-1px);
    }
}`;
