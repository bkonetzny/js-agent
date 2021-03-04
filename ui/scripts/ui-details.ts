export class UiDetails {
    private domElement: Element;

    constructor(domElement: Element) {
        this.domElement = domElement;
    }

    render(content: string) {
        this.domElement.innerHTML = content;
    }
}
