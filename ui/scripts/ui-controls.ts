import { Ui } from "./ui";
import { UiScene } from "./ui-scene";

export class UiControls {
    private ui: Ui;
    private domElement: Element;
    private scene: UiScene;
    private btnStart?: Element | null;
    private btnPause?: Element | null;
    private btnAddSource?: Element | null;
    private btnAddDestination?: Element | null;
    private btnAddBusyDestination?: Element | null;
    private btnAddAgent?: Element | null;
    private inputUpdateSettingKey?: HTMLSelectElement | Element | null;
    private inputUpdateSettingValue?: HTMLInputElement | Element | null;
    private btnUpdateSetting?: Element | null;
    private btnExport?: Element | null;
    private btnImport?: Element | null;

    constructor(ui: Ui, domElement: Element, scene: UiScene) {
        this.ui = ui;
        this.domElement = domElement;
        this.scene = scene;

        this.btnStart = this.domElement.querySelector('#start');
        this.btnPause = this.domElement.querySelector('#pause');
        this.btnAddSource = this.domElement.querySelector('#addSource');
        this.btnAddDestination = this.domElement.querySelector('#addDestination');
        this.btnAddBusyDestination = this.domElement.querySelector('#addBusyDestination');
        this.btnAddAgent = this.domElement.querySelector('#addAgent');
        this.inputUpdateSettingKey = this.domElement.querySelector('#updateSettingKey');
        this.inputUpdateSettingValue = this.domElement.querySelector('#updateSettingValue');
        this.btnUpdateSetting = this.domElement.querySelector('#updateSetting');
        this.btnExport = this.domElement.querySelector('#export');
        this.btnImport = this.domElement.querySelector('#import');

        this.addEventListeners();
    }

    addEventListeners() {
        this.btnStart?.addEventListener('click', (event) => {
            this.ui.handleInput('control:start');
        });

        this.btnPause?.addEventListener('click', (event) => {
            this.ui.handleInput('control:pause');
        });

        this.btnAddSource?.addEventListener('click', (event) => {
            this.scene.setClickMode('addSource');
        });

        this.btnAddDestination?.addEventListener('click', (event) => {
            this.scene.setClickMode('addDestination');
        });

        this.btnAddBusyDestination?.addEventListener('click', (event) => {
            this.scene.setClickMode('addBusyDestination');
        });

        this.btnAddAgent?.addEventListener('click', (event) => {
            this.scene.setClickMode('addAgent');
        });

        this.btnUpdateSetting?.addEventListener('click', (event) => {
            // @ts-ignore
            let oldValue = this.ui.handleInput('setting:update', {key: this.inputUpdateSettingKey.value, value: this.inputUpdateSettingValue.value}).oldValue;

            // @ts-ignore
            console.log('Update setting ' + this.inputUpdateSettingKey.value + ' from "' + oldValue + '" to "' + this.inputUpdateSettingValue.value + '"');
        });

        this.btnExport?.addEventListener('click', (event) => {
            console.log('Export:', this.ui.handleInput('gamestate:export'));
        });

        this.btnImport?.addEventListener('click', (event) => {
            const state = {
                settings: {},
                locations: [],
                agents: [],
                jobs: [],
            };

            this.ui.handleInput('gamestate:import', {state: JSON.stringify(state)});
        });
    }
}
