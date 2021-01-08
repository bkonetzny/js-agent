// @ts-check

class UiScene {
    /**
     *
     * @param {Element} domElement
     * @param {Document} domDocument
     * @param {Game} game
     * @param {UiDetails} uiDetails
     */
    constructor(domElement, domDocument, game, uiDetails) {
        this.domElement = domElement;
        this.domDocument = domDocument;
        this.game = game;
        this.uiDetails = uiDetails;

        this.sceneRect = this.domElement.getBoundingClientRect();
        this.clickMode = null;

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
                instanceId = this.game.addLocation(new LocationEntity(position, 'source'));
                break;

            case 'addDestination':
                instanceId = this.game.addLocation(new LocationEntity(position, 'destination'));
                break;

            case 'addBusyDestination':
                instanceId = this.game.addLocation(new LocationEntity(position, 'destination-busy'));
                break;

            case 'addAgent':
                instanceId = this.game.addAgent(new AgentEntity(position));
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
        this.showDetails(event.target.id);
    }

    /**
     *
     * @param {MouseEvent} event
     * @return {Position}
     */
    getPositionForEvent(event) {
        return new Position(event.clientX - this.sceneRect.left, event.clientY - this.sceneRect.top);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     * @param {AgentEntity[]} agents
     */
    render(locations, agents) {
        this.domRemoveObsoleteLocations(locations);
        this.domRemoveObsoleteAgents(agents);

        this.domUpdateLocations(locations);
        this.domUpdateAgents(agents);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     */
    domRemoveObsoleteLocations(locations) {
        let domLocations = this.domElement.querySelectorAll('.building');
        let locationIds = locations.map((location) => {
            return location.id;
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

            domBuilding.classList.add('building-' + building.type);
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
     * @return {HTMLDivElement}
     */
    domEnsureElementForTyoe(type, id) {
        /** @type {HTMLDivElement} */
        let element = this.domElement.querySelector('#' + id);

        if (!element) {
            element = this.domDocument.createElement('div');
            element.id = id;

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

    /**
     *
     * @param {String} id
     */
    showDetails(id) {
        const matchingLocation = this.game.locations.findOneById(id);

        if (!matchingLocation) {
            return;
        }

        this.uiDetails.render(`
            <dl>
                <dt>ID</dt>
                <dd>${matchingLocation.id}</dd>
                <dt>Actions</dt>
                <dd><a href="#">Remove</a></dd>
            </dl>
        `);
    }
}
