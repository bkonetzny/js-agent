// @ts-check

class UiScene {
    /**
     *
     * @param {Game} game
     * @param {Document} domDocument
     * @param {String} sceneSelector
     */
    constructor(game, domDocument, sceneSelector) {
        this.game = game;
        this.domDocument = domDocument;
        this.sceneSelector = sceneSelector;

        this.scene = this.domDocument.querySelector(this.sceneSelector);
        this.sceneRect = this.scene.getBoundingClientRect();
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
        if (!this.clickMode) {
            return;
        }

        var position = this.getPositionForEvent(event);

        console.log('click on:', position);
        console.log('click mode:', this.clickMode);

        switch (this.clickMode) {
            case 'addSource':
                this.game.addLocation(new LocationEntity(position, 'source'));
                break;

            case 'addDestination':
                this.game.addLocation(new LocationEntity(position, 'destination'));
                break;

            case 'addBusyDestination':
                this.game.addLocation(new LocationEntity(position, 'destination-busy'));
                break;

            case 'addAgent':
                this.game.addAgent(new AgentEntity(position));
                break;

            default:
                console.log('Unknown clickMode: ', this.clickMode);
                break;
        }

        // this.clickMode = null;
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
            var domBuilding = this.createDomElementForTyoe('building', building.position);
            domBuilding.classList.add('building-' + building.type);

            this.scene.appendChild(domBuilding);
        });

        agents.forEach((agent) => {
            var domAgent = this.createDomElementForTyoe('agent', agent.position);
            domAgent.classList.add('agent-state-' + (agent.job ? (agent.job.started ? 'packed' : 'busy') : 'idle'));

            this.scene.appendChild(domAgent);
        });
    }

    /**
     *
     * @param {string} type
     * @param {Position} position
     * @return {HTMLDivElement}
     */
    createDomElementForTyoe(type, position) {
        var element = this.domDocument.createElement('div');
        element.classList.add(type);
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';

        return element;
    }
}
