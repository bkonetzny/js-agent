// @ts-check

class Ui {
    /**
     *
     * @param {Game} game
     * @param {Document} domDocument
     * @param {String} controlsSelector
     * @param {String} sceneSelector
     * @param {String} detailsSelector
     */
    constructor(game, domDocument, controlsSelector, sceneSelector, detailsSelector) {
        this.game = game;
        this.controlsSelector = controlsSelector;
        this.sceneSelector = sceneSelector;
        this.detailsSelector = detailsSelector;

        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);
        this.sceneSelector = domDocument.querySelector(this.sceneSelector);
        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);

        this.details = new UiDetails(this.detailsDomElement);
        this.scene = new UiScene(this.sceneSelector, domDocument, this.game, this.details);
        this.controls = new UiControls(this.controlsDomElement, this.game, this.scene);

        this.game.setUi(this);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     * @param {AgentEntity[]} agents
     * @param {Job[]} jobs
     */
    publish(locations, agents, jobs) {
        this.scene.render(locations, agents);
    }
}
