import { ControlPauseInputCommand, ControlStartInputCommand, GamestateExportInputCommand, GamestateImportInputCommand } from "../../io-bridge/input-commands";
import { Ui } from "./ui";
import { UiScene } from "./ui-scene";

export class UiControls {
    private ui: Ui;
    private domDocument: Document;
    private domElement: Element;
    private scene: UiScene;
    private btnStart: Element;
    private btnPause: Element;
    private btnLocationsWrapper: Element;
    private btnAddAgent: Element;
    /*
    private inputUpdateSettingKey: HTMLSelectElement;
    private inputUpdateSettingValue: HTMLInputElement;
    private btnUpdateSetting: Element;
    */
    private btnExport: Element;
    private btnImport: Element;
    private btnDemo: Element;

    constructor(ui: Ui, domDocument: Document, domElement: Element, scene: UiScene) {
        this.ui = ui;
        this.domDocument = domDocument;
        this.domElement = domElement;
        this.scene = scene;

        this.btnStart = this.domElement.querySelector('#start')!;
        this.btnPause = this.domElement.querySelector('#pause')!;
        this.btnLocationsWrapper = this.domElement.querySelector('#locations')!;
        this.btnAddAgent = this.domElement.querySelector('#addAgent')!;
        /*
        this.inputUpdateSettingKey = this.domElement.querySelector('#updateSettingKey')!;
        this.inputUpdateSettingValue = this.domElement.querySelector('#updateSettingValue')!;
        this.btnUpdateSetting = this.domElement.querySelector('#updateSetting')!;
        */
        this.btnExport = this.domElement.querySelector('#export')!;
        this.btnImport = this.domElement.querySelector('#import')!;
        this.btnDemo = this.domElement.querySelector('#demo')!;

        this.addEventListeners();
    }

    addEventListeners() {
        this.btnStart.addEventListener('click', (event) => {
            this.ui.handleInput(new ControlStartInputCommand());
        });

        this.btnPause.addEventListener('click', (event) => {
            this.ui.handleInput(new ControlPauseInputCommand());
        });

        this.btnLocationsWrapper.addEventListener('click', (event) => {
            this.scene.setClickMode((event.target as Element)!.id);
        });

        this.btnAddAgent.addEventListener('click', (event) => {
            this.scene.setClickMode('agent:add');
        });

        /*
        this.btnUpdateSetting.addEventListener('click', (event) => {
            const oldValue = this.ui.handleInput('setting:update', {key: this.inputUpdateSettingKey.value, value: this.inputUpdateSettingValue.value}).oldValue;

            console.log('Update setting ' + this.inputUpdateSettingKey.value + ' from "' + oldValue + '" to "' + this.inputUpdateSettingValue.value + '"');
        });
        */

        this.btnExport.addEventListener('click', (event) => {
            const exportData = this.ui.handleInput(new GamestateExportInputCommand);
            console.log('Export:', exportData, JSON.parse(exportData));
        });

        this.btnImport.addEventListener('click', (event) => {
            this.ui.handleInput(new GamestateImportInputCommand({
                settings: {},
                locations: [],
                agents: [],
                jobs: [],
            }));
        });

        this.btnDemo.addEventListener('click', (event) => {
            this.btnDemo.setAttribute('disabled', 'disabled');

            this.scene.setClickMode('location:add:SourceLocation');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 100,
                clientY: 100,
            }));

            this.scene.setClickMode('location:add:DestinationLocation');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 200,
                clientY: 200,
            }));

            this.scene.setClickMode('location:add:DestinationLocation');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 400,
                clientY: 50,
            }));

            this.scene.setClickMode('agent:add');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 300,
                clientY: 150,
            }));

            this.scene.setClickMode('agent:add');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 250,
                clientY: 50,
            }));

            this.scene.setClickMode('agent:add');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 50,
                clientY: 180,
            }));

            this.scene.setClickMode('agent:add');
            this.scene.processClickEventOnScene(new MouseEvent('click', {
                clientX: 100,
                clientY: 400,
            }));

            this.ui.handleInput(new ControlStartInputCommand());
        });
    }

    render(running: boolean, settings: any) {
        if (running) {
            this.btnStart.setAttribute('disabled', 'disabled');
            this.btnPause.removeAttribute('disabled');
        } else {
            this.btnPause.setAttribute('disabled', 'disabled');
            this.btnStart.removeAttribute('disabled');
        }

        // TODO: allow updates to the buttons, for now it's only rendered once.
        if (this.btnLocationsWrapper.innerHTML === '' && settings?.locations) {
            this.btnLocationsWrapper.innerHTML = '';

            settings.locations.forEach(location => {
                const button = this.domDocument.createElement('button');
                button.id = `location:add:${location.id}`;
                button.innerText = `Add ${location.id}`;

                this.btnLocationsWrapper.appendChild(button);
            });
        }
    }
}
