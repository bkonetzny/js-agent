// @ts-check

class UiControls {
    /**
     *
     * @param {Game} game
     * @param {UiScene} scene
     * @param {Document} domDocument
     * @param {String} controlsSelector
     */
    constructor(game, scene, domDocument, controlsSelector) {
        this.game = game;
        this.scene = scene;
        this.controlsSelector = controlsSelector;
        this.controls = domDocument.querySelector(this.controlsSelector);

        this.btnStart = this.controls.querySelector('#start');
        this.btnPause = this.controls.querySelector('#pause');
        this.btnAddSource = this.controls.querySelector('#addSource');
        this.btnAddDestination = this.controls.querySelector('#addDestination');
        this.btnAddBusyDestination = this.controls.querySelector('#addBusyDestination');
        this.btnAddAgent = this.controls.querySelector('#addAgent');
        this.btnExport = this.controls.querySelector('#export');
        this.btnImport = this.controls.querySelector('#import');

        this.addEventListeners();
    }

    addEventListeners() {
        this.btnStart.addEventListener('click', (event) => {
            this.game.controlStart();
        });

        this.btnPause.addEventListener('click', (event) => {
            this.game.controlPause();
        });

        this.btnAddSource.addEventListener('click', (event) => {
            this.scene.setClickMode('addSource');
        });

        this.btnAddDestination.addEventListener('click', (event) => {
            this.scene.setClickMode('addDestination');
        });

        this.btnAddBusyDestination.addEventListener('click', (event) => {
            this.scene.setClickMode('addBusyDestination');
        });

        this.btnAddAgent.addEventListener('click', (event) => {
            this.scene.setClickMode('addAgent');
        });

        this.btnExport.addEventListener('click', (event) => {
            console.log('Export:', this.game.exportState());
        });

        this.btnImport.addEventListener('click', (event) => {
            const state = {
                locations: [],
                agents: [],
                jobs: [],
            };

            this.game.importState(JSON.stringify(state));
        });
    }
}
