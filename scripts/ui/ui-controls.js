// @ts-check

class UiControls {
    /**
     *
     * @param {Element} domElement
     * @param {Game} game
     * @param {UiScene} scene
     */
    constructor(domElement, game, scene) {
        this.domElement = domElement;
        this.game = game;
        this.scene = scene;

        this.btnStart = this.domElement.querySelector('#start');
        this.btnPause = this.domElement.querySelector('#pause');
        this.btnAddSource = this.domElement.querySelector('#addSource');
        this.btnAddDestination = this.domElement.querySelector('#addDestination');
        this.btnAddBusyDestination = this.domElement.querySelector('#addBusyDestination');
        this.btnAddAgent = this.domElement.querySelector('#addAgent');
        this.btnExport = this.domElement.querySelector('#export');
        this.btnImport = this.domElement.querySelector('#import');

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