import { Ui } from "./ui";

export class UiMeta {
    /**
     *
     * @param {Ui} ui
     * @param {Element} domElement
     */
    constructor(ui, domElement) {
        this.ui = ui;
        this.domElement = domElement;
        this.counter = 0;

        setInterval(() => {
            this.domElement.innerHTML = `${this.counter} FPS`;
            this.counter = 0;
        }, 1000);
    }

    render() {
        this.counter++;
    }
}
