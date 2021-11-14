import hash from "hash-it";
import { LocationActionInputCommand } from "../../io-bridge/input-commands";
import { Ui } from "./ui";

export class UiDetails {
    private ui: Ui;
    private domElement: Element;
    private contentHash?: number;

    constructor(ui: Ui, domElement: Element) {
        this.ui = ui;
        this.domElement = domElement;

        // @ts-ignore
        this.domElement.addEventListener('click', (event: MouseEvent) => {
            this.processClickEvent(event);
        });
    }

    render(content: string) {
        const newContentHash = hash(content);

        if (this.contentHash === newContentHash) {
            return;
        }

        this.domElement.innerHTML = content;
        this.contentHash = newContentHash;
    }

    processClickEvent(event: MouseEvent) {
        const button = (event.target as HTMLButtonElement)!;

        this.ui.handleInput(new LocationActionInputCommand(button.dataset.locationid!, button.dataset.action!));
    }
}
