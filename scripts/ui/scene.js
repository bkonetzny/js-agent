// @ts-check

class UiScene {
    /**
     *
     * @param {Game} game
     * @param {Document} domDocument
     * @param {String} sceneSelector
     * @param {String} detailsSelector
     */
    constructor(game, domDocument, sceneSelector, detailsSelector) {
        this.game = game;
        this.domDocument = domDocument;
        this.sceneSelector = sceneSelector;
        this.detailsSelector = detailsSelector;

        this.scene = this.domDocument.querySelector(this.sceneSelector);
        this.sceneRect = this.scene.getBoundingClientRect();
        this.details = this.domDocument.querySelector(this.detailsSelector);
        this.clickMode = null;

        this.scene.addEventListener('click', (/** @type {MouseEvent} */ event) => {
            this.processClickEvent(event);
        });

        this.game.setScene(this);
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
        if (event.target !== this.scene) {
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
     * @param {Job[]} jobs
     */
    render(locations, agents, jobs) {
        /*console.table(locations);
        console.table(agents);
        console.table(jobs);*/

        while (this.scene.firstChild) {
            this.scene.firstChild.remove();
        }

        locations.forEach((building) => {
            var domBuilding = this.createDomElementForTyoe('building', building.position, building.id);
            domBuilding.classList.add('building-' + building.type);

            this.scene.appendChild(domBuilding);
        });

        agents.forEach((agent) => {
            var domAgent = this.createDomElementForTyoe('agent', agent.position, agent.id);
            domAgent.classList.add('agent-state-' + (agent.job ? (agent.job.started ? 'packed' : 'busy') : 'idle'));

            this.scene.appendChild(domAgent);
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

        console.log(matchingLocation);

        while (this.details.firstChild) {
            this.details.firstChild.remove();
        }

        this.details.innerHTML = `
            <dl>
                <dt>ID</dt>
                <dd>${matchingLocation.id}</dd>
                <dt>Actions</dt>
                <dd><a href="#">Remove</a></dd>
            </dl>
        `;
    }
}
