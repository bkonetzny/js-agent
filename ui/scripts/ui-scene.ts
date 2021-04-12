import { AgentEntity } from "../../engine/objects/instances/entities/agent-entity";
import { LocationEntity } from "../../engine/objects/instances/entities/location-entity";
import { Position } from "../../engine/objects/position";
import { Ui } from "./ui";
import { UiDetails } from "./ui-details";

export class UiScene {
    private ui: Ui;
    private domElement: Element;
    private domDocument: Document;
    private uiDetails: UiDetails;
    private clickMode?: string;
    private focusedObjectId?: string;
    private locationCache: LocationEntity[];
    private domElementIdPrefix: string;
    private domHoverLayerElement: HTMLDivElement;
    private domHoverElement: HTMLDivElement;

    constructor(ui: Ui, domElement: Element, domDocument: Document, uiDetails: UiDetails) {
        this.ui = ui;
        this.domElement = domElement;
        this.domDocument = domDocument;
        this.uiDetails = uiDetails;

        this.clickMode = undefined;
        this.focusedObjectId = undefined;
        this.locationCache = [];
        this.domElementIdPrefix = 'id-';

        this.domHoverLayerElement = this.domDocument.createElement('div');
        this.domHoverLayerElement.classList.add('hover-layer');
        this.domElement.appendChild(this.domHoverLayerElement);

        this.domHoverElement = this.domDocument.createElement('div');
        this.domHoverElement.classList.add('hover');
        this.domElement.appendChild(this.domHoverElement);

        // @ts-ignore
        this.domHoverLayerElement.addEventListener('pointermove', (event: PointerEvent) => {
            this.processHoverEvent(event);
        });

        // @ts-ignore
        this.domHoverLayerElement.addEventListener('mouseout', (event: PointerEvent) => {
            this.processHoverEndEvent();
        });

        // @ts-ignore
        this.domHoverLayerElement.addEventListener('click', (event: MouseEvent) => {
            this.processClickEvent(event);
        });

        // @ts-ignore
        this.domElement.addEventListener('click', (event: MouseEvent) => {
            this.processClickEvent(event);
        });
    }

    setClickMode(clickMode: string) {
        this.clickMode = clickMode;

        if (!this.domHoverLayerElement.classList.contains('active')) {
            this.domHoverLayerElement.classList.add('active');
        }
    }

    getClickMode(): string | undefined {
        return this.clickMode;
    }

    processHoverEvent(event: PointerEvent) {
        this.processHoverEventOnScene(event);
    }

    processHoverEventOnScene(event: PointerEvent) {
        if (!this.clickMode
            || !this.clickMode.startsWith('location:add:')
        ) {
            return;
        }

        const locationId = this.clickMode.split(':').pop();

        this.domHoverElement.innerText = '';

        const position = this.getPositionForEvent(event);

        const handleInputResult = this.ui.handleInput('location:add:check', {
            id: locationId,
            position: position
        });

        if (!this.domHoverElement.classList.contains('active')) {
            this.domHoverElement.classList.add('active');
        }

        this.domHoverElement.style.left = position.x + 'px';
        this.domHoverElement.style.top = position.y + 'px';

        if (handleInputResult instanceof Error) {
            this.domHoverElement.innerText = handleInputResult.message;
            this.domHoverElement.classList.remove('valid');
            this.domHoverElement.classList.add('invalid');
        }
        else {
            this.domHoverElement.classList.remove('invalid');
            this.domHoverElement.classList.add('valid');
        }
    }

    processHoverEndEvent() {
        this.domHoverLayerElement.classList.remove('active');
        this.domHoverElement.classList.remove('active');
        this.domHoverElement.innerText = '';
    }

    processClickEvent(event: MouseEvent) {
        this.focusedObjectId = undefined;

        if (event.target !== this.domElement
            && event.target !== this.domHoverLayerElement
        ) {
            this.processClickEventOnObject(event);
        }
        else {
            this.processClickEventOnScene(event);
        }
    }

    processClickEventOnScene(event: MouseEvent) {
        if (!this.clickMode) {
            return;
        }

        const locationId = this.clickMode.split(':').pop();

        const position = this.getPositionForEvent(event);

        let handleInputResult: boolean | Error = false;

        if (this.clickMode.startsWith('location:add:')) {
            handleInputResult = this.ui.handleInput('location:add', {
                id: locationId,
                position: position,
            });
        }
        else if (this.clickMode.startsWith('agent:add')) {
            handleInputResult = this.ui.handleInput('agent:add', {
                position: position,
            });
        }

        console.log('handleInputResult:', handleInputResult);

        if (handleInputResult instanceof Error) {
            this.domHoverElement.innerText = handleInputResult.message;
            return;
        }

        this.clickMode = undefined;
        this.processHoverEndEvent();
    }

    processClickEventOnObject(event: MouseEvent) {
        this.focusedObjectId = (event.target as Element)!.id;
        this.updateDetails();
    }

    getPositionForEvent(event: MouseEvent | PointerEvent): Position {
        const sceneRect = this.domElement.getBoundingClientRect();

        return new Position(event.clientX - sceneRect.left, event.clientY - sceneRect.top);
    }

    render(locations: LocationEntity[], agents: AgentEntity[]) {
        this.locationCache = locations;

        this.domRemoveObsoleteLocations(locations);
        this.domRemoveObsoleteAgents(agents);

        this.domUpdateLocations(locations);
        this.domUpdateAgents(agents);

        this.updateDetails();
    }

    domRemoveObsoleteLocations(locations: LocationEntity[]) {
        const domLocations = this.domElement.querySelectorAll('.building');
        const locationIds = locations.map((location) => {
            return `${this.domElementIdPrefix}${location.id}`;
        });

        domLocations.forEach((domLocation) => {
            if (!locationIds.includes(domLocation.id)) {
                domLocation.remove();
            }
        });
    }

    domRemoveObsoleteAgents(agents: AgentEntity[]) {
        const domAgents = this.domElement.querySelectorAll('.agent');
        const agentIds = agents.map((agent) => {
            return agent.id;
        });

        domAgents.forEach((domAgent) => {
            if (!agentIds.includes(domAgent.id)) {
                domAgent.remove();
            }
        });
    }

    domUpdateLocations(locations: LocationEntity[]) {
        locations.forEach((building) => {
            const domBuilding = this.domEnsureElementForTyoe('building', building.id);

            this.domUpdateElementPosition(domBuilding, building.position);

            domBuilding.classList.add('building-' + building.constructor.name);
        });
    }

    domUpdateAgents(agents: AgentEntity[]) {
        agents.forEach((agent) => {
            const domAgent = this.domEnsureElementForTyoe('agent', agent.id);

            this.domUpdateElementPosition(domAgent, agent.position);

            const job = agent.getJob();

            domAgent.classList.add('agent-state-' + (job ? (job.started ? 'packed' : 'busy') : 'idle'));
        });
    }

    domEnsureElementForTyoe(type: string, id: string): HTMLDivElement {
        let element: HTMLDivElement | null = this.domElement.querySelector(`#${this.domElementIdPrefix}${id}`);

        if (!element) {
            element = this.domDocument.createElement('div');
            element.id = `${this.domElementIdPrefix}${id}`;

            this.domElement.appendChild(element);
        }

        // @ts-ignore
        element.classList.remove(...element.classList);
        element.classList.add(type);

        return element;
    }

    domUpdateElementPosition(element: HTMLDivElement, position: Position) {
        element.style.left = `${position.x}px`;
        element.style.top = `${position.y}px`;
    }

    updateDetails() {
        this.showDetails(this.focusedObjectId);
    }

    showDetails(id?: string) {
        if (!id) {
            this.uiDetails.render('');

            return;
        }

        const matchingLocation = this.locationCache.find((location) => {
            return `${this.domElementIdPrefix}${location.id}` === id;
        });

        if (!matchingLocation) {
            return;
        }

        const resources = matchingLocation.getResources();
        const resourcesByType = {};

        resources.forEach((resource) => {
            if (!resourcesByType[resource.constructor.name]) {
                resourcesByType[resource.constructor.name] = 0;
            }

            resourcesByType[resource.constructor.name]++;
        });

        this.uiDetails.render(`
            <dl>
                <dt>ID</dt>
                <dd>${matchingLocation.id}</dd>
                <dt>Type</dt>
                <dd>${matchingLocation.constructor.name}</dd>
                <dt>Resources (${resources.length})</dt>
                <dd>${JSON.stringify(resourcesByType)}</dd>
                <dt>Actions</dt>
                <dd><a href="#">Remove</a></dd>
            </dl>
        `);
    }
}
