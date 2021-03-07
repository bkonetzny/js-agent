import { AgentEntity } from "../../engine/objects/instances/entities/agent-entity";
import { LocationEntity } from "../../engine/objects/instances/entities/location-entity";
import { DestinationLocation } from "../../engine/objects/instances/entities/locations/destination";
import { DestinationBusyLocation } from "../../engine/objects/instances/entities/locations/destination-busy";
import { SourceLocation } from "../../engine/objects/instances/entities/locations/source";
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

    constructor(ui: Ui, domElement: Element, domDocument: Document, uiDetails: UiDetails) {
        this.ui = ui;
        this.domElement = domElement;
        this.domDocument = domDocument;
        this.uiDetails = uiDetails;

        this.clickMode = undefined;
        this.focusedObjectId = undefined;
        this.locationCache = [];
        this.domElementIdPrefix = 'id-';

        // @ts-ignore
        this.domElement.addEventListener('click', (event: MouseEvent) => {
            this.processClickEvent(event);
        });
    }

    setClickMode(clickMode: string) {
        this.clickMode = clickMode;
    }

    processClickEvent(event: MouseEvent) {
        this.focusedObjectId = undefined;

        if (event.target !== this.domElement) {
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

        const position = this.getPositionForEvent(event);

        console.log('click on:', position);
        console.log('click mode:', this.clickMode);

        let instanceId;

        switch (this.clickMode) {
            case 'addSource':
                instanceId = this.ui.handleInput('location:add', new SourceLocation(position));
                break;

            case 'addDestination':
                instanceId = this.ui.handleInput('location:add', new DestinationLocation(position));
                break;

            case 'addBusyDestination':
                instanceId = this.ui.handleInput('location:add', new DestinationBusyLocation(position));
                break;

            case 'addAgent':
                instanceId = this.ui.handleInput('agent:add', new AgentEntity(position));
                break;

            default:
                console.log('Unknown clickMode: ', this.clickMode);
                break;
        }

        if (instanceId) {
            console.log('Added instance:', instanceId);
        }

        // this.clickMode = null;
    }

    processClickEventOnObject(event: MouseEvent) {
        this.focusedObjectId = (event.target as Element)?.id;
        this.updateDetails();
    }

    getPositionForEvent(event: MouseEvent): Position {
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
