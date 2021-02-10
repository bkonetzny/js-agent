
export class UiDetails {
    /**
     *
     * @param {Element} domElement
     */
    constructor(domElement) {
        this.domElement = domElement;
    }

    /**
     *
     * @param {String} content
     */
    render(content) {
        this.domElement.innerHTML = content;
    }
}
