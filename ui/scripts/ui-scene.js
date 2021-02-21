import { AgentEntity } from "../../engine/objects/instances/entities/agent-entity";
import { LocationEntity } from "../../engine/objects/instances/entities/location-entity";
import { DestinationLocation } from "../../engine/objects/instances/entities/locations/destination";
import { DestinationBusyLocation } from "../../engine/objects/instances/entities/locations/destination-busy";
import { SourceLocation } from "../../engine/objects/instances/entities/locations/source";
import { Position } from "../../engine/objects/position";
import { Ui } from "./ui";
import { UiDetails } from "./ui-details";

export class UiScene {
    /**
     *
     * @param {Ui} ui
     * @param {Element} domElement
     * @param {Document} domDocument
     * @param {UiDetails} uiDetails
     */
    constructor(ui, domElement, domDocument, uiDetails) {
        this.ui = ui;
        this.domElement = domElement;
        this.domDocument = domDocument;
        this.uiDetails = uiDetails;

        this.clickMode = null;
        this.focusedObjectId = null;
        this.locationCache = null;
        this.domElementIdPrefix = 'id-';

        this.domElement.addEventListener('click', (/** @type {MouseEvent} */ event) => {
            this.processClickEvent(event);
        });
    }

    /**
     *
     * @param {String} clickMode
     */
    setClickMode(clickMode) {
        this.clickMode = clickMode;
    }

    /**
     *
     * @param {MouseEvent} event
     */
    processClickEvent(event) {
        this.focusedObjectId = null;

        if (event.target !== this.domElement) {
            this.processClickEventOnObject(event);
        }
        else {
            this.processClickEventOnScene(event);
        }
    }

    /**
     *
     * @param {MouseEvent} event
     */
    processClickEventOnScene(event) {
        if (!this.clickMode) {
            return;
        }

        let position = this.getPositionForEvent(event);

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

    /**
     *
     * @param {MouseEvent} event
     */
    processClickEventOnObject(event) {
        this.focusedObjectId = event.target.id;
        this.updateDetails();
    }

    /**
     *
     * @param {MouseEvent} event
     * @returns {Position}
     */
    getPositionForEvent(event) {
        const sceneRect = this.domElement.getBoundingClientRect();

        return new Position(event.clientX - sceneRect.left, event.clientY - sceneRect.top);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     * @param {AgentEntity[]} agents
     */
    render(locations, agents) {
        this.locationCache = locations;

        this.domRemoveObsoleteLocations(locations);
        this.domRemoveObsoleteAgents(agents);

        this.domUpdateLocations(locations);
        this.domUpdateAgents(agents);

        this.updateDetails();
    }

    /**
     *
     * @param {LocationEntity[]} locations
     */
    domRemoveObsoleteLocations(locations) {
        let domLocations = this.domElement.querySelectorAll('.building');
        let locationIds = locations.map((location) => {
            return `${this.domElementIdPrefix}${location.id}`;
        });

        domLocations.forEach((domLocation) => {
            if (!locationIds.includes(domLocation.id)) {
                domLocation.remove();
            }
        });
    }

    /**
     *
     * @param {AgentEntity[]} agents
     */
    domRemoveObsoleteAgents(agents) {
        let domAgents = this.domElement.querySelectorAll('.agent');
        let agentIds = agents.map((agent) => {
            return agent.id;
        });

        domAgents.forEach((domAgent) => {
            if (!agentIds.includes(domAgent.id)) {
                domAgent.remove();
            }
        });
    }

    /**
     *
     * @param {LocationEntity[]} locations
     */
    domUpdateLocations(locations) {
        locations.forEach((building) => {
            let domBuilding = this.domEnsureElementForTyoe('building', building.id);

            this.domUpdateElementPosition(domBuilding, building.position);

            domBuilding.classList.add('building-' + building.constructor.name);
        });
    }

    /**
     *
     * @param {AgentEntity[]} agents
     */
    domUpdateAgents(agents) {
        agents.forEach((agent) => {
            let domAgent = this.domEnsureElementForTyoe('agent', agent.id);

            this.domUpdateElementPosition(domAgent, agent.position);

            let job = agent.getJob();

            domAgent.classList.add('agent-state-' + (job ? (job.started ? 'packed' : 'busy') : 'idle'));
        });
    }

    /**
     *
     * @param {String} type
     * @param {String} id
     * @returns {HTMLDivElement}
     */
    domEnsureElementForTyoe(type, id) {
        /** @type {HTMLDivElement} */
        let element = this.domElement.querySelector(`#${this.domElementIdPrefix}${id}`);

        if (!element) {
            element = this.domDocument.createElement('div');
            element.id = `${this.domElementIdPrefix}${id}`;

            this.domElement.appendChild(element);
        }

        element.classList.remove(...element.classList);
        element.classList.add(type);

        return element;
    }

    /**
     *
     * @param {HTMLDivElement} element
     * @param {Position} position
     */
    domUpdateElementPosition(element, position) {
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';
    }

    updateDetails() {
        this.showDetails(this.focusedObjectId);
    }

    /**
     *
     * @param {String|null} id
     */
    showDetails(id) {
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
        let resourcesByType = {};

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