import { Location } from "../../../io-bridge/types/location";

export class UiLocation {
    public location: Location;
    private domDocument: Document;
    private domElementIdPrefix: string;

    constructor(location: Location, domDocument: Document, domElementPrefix: string) {
        this.location = location;
        this.domDocument = domDocument;
        this.domElementIdPrefix = domElementPrefix;
    }

    getDomElementId(): string {
        return `${this.domElementIdPrefix}${this.location.id}`;
    }

    getDomElement(): HTMLDivElement {
        return <HTMLDivElement>this.domDocument.getElementById(this.getDomElementId());
    }
}
