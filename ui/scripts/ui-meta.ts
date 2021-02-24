import { Ui } from "./ui";

export class UiMeta {
    private ui: Ui;
    private domElement: Element;
    private counter: number;

    constructor(ui: Ui, domElement: Element) {
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
