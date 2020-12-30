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

        var position = this.getPositionForEvent(event);

        console.log('click on:', position);
        console.log('click mode:', this.clickMode);

        var instanceId = null;

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
        /*console.table(locations);
        console.table(agents);*/

        while (this.domElement.firstChild) {
            this.domElement.firstChild.remove();
        }

        locations.forEach((building) => {
            var domBuilding = this.createDomElementForTyoe('building', building.position, building.id);
            domBuilding.classList.add('building-' + building.type);

            this.domElement.appendChild(domBuilding);
        });

        agents.forEach((agent) => {
            var domAgent = this.createDomElementForTyoe('agent', agent.position, agent.id);
            domAgent.classList.add('agent-state-' + (agent.job ? (agent.job.started ? 'packed' : 'busy') : 'idle'));

            this.domElement.appendChild(domAgent);
        });
    }

    /**
     *
     * @param {String} type
     * @param {Position} position
     * @param {String} id
     * @return {HTMLDivElement}
     */
    createDomElementForTyoe(type, position, id) {
        var element = this.domDocument.createElement('div');
        element.id = id;
        element.classList.add(type);
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';

        return element;
    }

    /**
     *
     * @param {String} id
     */
    showDetails(id) {
        const matchingLocation = this.game.locations.filter((location) => {
            return location.id === id;
        }).shift();

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
