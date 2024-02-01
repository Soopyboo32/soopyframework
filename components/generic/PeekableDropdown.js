import {html, staticCss, thisClass, useRef} from "../../helpers.js";
import {buttonCss} from "../../css.js";

let peekableDropdownContainerCss = staticCss.named("peekableDropdownContainer").css`${thisClass} {
    position: relative;
}`

let buttonContainerCss = staticCss.named("peekableDropdownButtonContainer").css`${thisClass} {
    display: flex;
    align-items: center;
    flex-direction: column;
}`

let peekableDropdownCss = staticCss.named("peekableDropdown").css`${thisClass} {
    height: 150px;
    transition: height 1s;
    overflow: hidden;
    -webkit-mask-image: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)
    );
}`

let peekableDropdownOpenCss = staticCss.named("peekableDropdownOpen").css`${thisClass} {
    height: auto;
    margin-bottom: 40px;
    -webkit-mask-image: none;
}`

let peekableDropdownOpenButtonCss = buttonCss.named("peekableDropdownOpenButton").css`{
    ${thisClass} {
        position: absolute;
        bottom: 0;
    }

    ${thisClass}::after {
        content: "OPEN";
    }

    ${peekableDropdownOpenCss} + ${thisClass}::after {
        content: "CLOSE";
    }
}`

export function PeekableDropdown(content, css = undefined, contentCss = undefined, isOpen = false, onOpen = newVal => {
}) {
    let ref = useRef();
    let dropdownContentRef = useRef();
    let buttonRef = useRef().onClick(() => {
        dropdownContentRef.toggleClass(peekableDropdownOpenCss);
    });

    let containerCss = css ? peekableDropdownContainerCss.merge(css) : peekableDropdownContainerCss;
    let contentContainerCss = contentCss ? peekableDropdownCss.merge(containerCss) : peekableDropdownCss;

    return html.withRef(ref)`
        <div ${ref} ${containerCss}>
            <div ${dropdownContentRef} ${contentContainerCss}>
                ${content}
            </div>
            <div ${buttonContainerCss}><button ${peekableDropdownOpenButtonCss} ${buttonRef}></button></div>
        </div>
    `
}