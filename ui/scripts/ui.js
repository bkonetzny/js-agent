// @ts-check

class Ui {
    /**
     *
     * @param {Document} domDocument
     * @param {String} controlsSelector
     * @param {String} sceneSelector
     * @param {String} detailsSelector
     */
    constructor(domDocument, controlsSelector, sceneSelector, detailsSelector) {
        this.inputHandler = null;

        this.controlsSelector = controlsSelector;
        this.sceneSelector = sceneSelector;
        this.detailsSelector = detailsSelector;

        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);
        this.sceneSelector = domDocument.querySelector(this.sceneSelector);
        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);

        this.details = new UiDetails(this.detailsDomElement);
        this.scene = new UiScene(this, this.sceneSelector, domDocument, this.details);
        this.controls = new UiControls(this, this.controlsDomElement, this.scene);
    }

    /**
     *
     * @param {InputHandler} inputHandler
     */
    setInputHandler(inputHandler) {
        this.inputHandler = inputHandler;
    }

    /**
     *
     * @param {String} command
     * @param {Object} data
     * @returns {any}
     */
    handleInput(command, data) {
        return this.inputHandler.command(command, data);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     * @param {AgentEntity[]} agents
     * @param {Job[]} jobs
     * @param {Resource[]} resources
     */
    updateState(locations, agents, jobs, resources) {
        /*
        console.clear();
        console.table(locations);
        console.table(agents);
        console.table(jobs);
        console.table(resources);
        */

        this.scene.render(locations, agents);
    }
}
