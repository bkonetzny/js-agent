import { difference } from "lodash-es";
import { AgentAddInputCommand, LocationAddInputCommand } from "../../io-bridge/input-commands";
import { Agent } from "../../io-bridge/types/agent";
import { Location } from "../../io-bridge/types/location";
import { Path } from "../../io-bridge/types/path";
import { Position } from "../../io-bridge/types/position";
import { Terrain } from "../../io-bridge/types/terrain";
import { Ui } from "./ui";
import { UiDetails } from "./ui-details";

export class UiScene {
    private ui: Ui;
    private domElement: HTMLDivElement;
    private domDocument: Document;
    private uiDetails: UiDetails;
    private clickMode?: string;
    private focusedObjectId?: string;
    private locationCache: Location[];
    private domElementIdPrefix: string;
    private domTerrainLayerElement: HTMLCanvasElement;
    private domObjectLayerElement: HTMLDivElement;
    private domHoverLayerElement: HTMLDivElement;
    private domHoverElement: HTMLDivElement;

    constructor(ui: Ui, domElement: HTMLDivElement, domDocument: Document, uiDetails: UiDetails) {
        this.ui = ui;
        this.domElement = domElement;
        this.domDocument = domDocument;
        this.uiDetails = uiDetails;

        this.clickMode = undefined;
        this.focusedObjectId = undefined;
        this.locationCache = [];
        this.domElementIdPrefix = 'id-';
        this.domTerrainLayerElement = this.domElement.querySelector('.layer-terrain')!;
        this.domObjectLayerElement = this.domElement.querySelector('.layer-objects')!;
        this.domHoverLayerElement = this.domElement.querySelector('.layer-hover')!;
        this.domHoverElement = this.domElement.querySelector('.hover')!;

        // @ts-ignore
        this.domHoverLayerElement.addEventListener('pointermove', (event: PointerEvent) => {
            this.processHoverEvent(event);
        });

        // @ts-ignore
        this.domHoverLayerElement.addEventListener('contextmenu', (event: MouseEvent) => {
            event.stopPropagation();
            this.processHoverEndEvent();
        });

        // @ts-ignore
        this.domHoverLayerElement.addEventListener('click', (event: MouseEvent) => {
            console.log('scene click', event);
            this.processClickEvent(event);
        });

        // @ts-ignore
        this.domElement.addEventListener('click', (event: MouseEvent) => {
            this.processClickEvent(event);
        });
    }

    setClickMode(clickMode: string) {
        this.clickMode = clickMode;

        if (!this.domHoverLayerElement.classList.contains('active')) {
            this.domHoverLayerElement.classList.add('active');
        }
    }

    getClickMode(): string | undefined {
        return this.clickMode;
    }

    processHoverEvent(event: PointerEvent) {
        this.processHoverEventOnScene(event);
    }

    processHoverEventOnScene(event: PointerEvent) {
        if (!this.clickMode
            || !this.clickMode.startsWith('location:add:')
        ) {
            return;
        }

        const locationId = this.clickMode.split(':').pop()!;

        this.domHoverElement.innerText = '';

        const position = this.getPositionForEvent(event);

        const handleInputResult = this.ui.handleInput(new LocationAddInputCommand(locationId, position, true));

        if (!this.domHoverElement.classList.contains('active')) {
            this.domHoverElement.classList.add('active');
        }

        this.domHoverElement.style.left = position.x + 'px';
        this.domHoverElement.style.top = position.y + 'px';

        if (handleInputResult instanceof Error) {
            this.domHoverElement.innerText = handleInputResult.message;
            this.domHoverElement.classList.remove('valid');
            this.domHoverElement.classList.add('invalid');
        }
        else {
            this.domHoverElement.classList.remove('invalid');
            this.domHoverElement.classList.add('valid');
        }
    }

    processHoverEndEvent() {
        this.domHoverLayerElement.classList.remove('active');
        this.domHoverElement.classList.remove('active');
        this.domHoverElement.innerText = '';
    }

    processClickEvent(event: MouseEvent) {
        this.focusedObjectId = undefined;

        if (event.target !== this.domElement
            && event.target !== this.domHoverLayerElement
            && event.target !== this.domHoverElement
        ) {
            this.processClickEventOnObject(event);
        }
        else {
            this.processClickEventOnScene(event);
        }
    }

    processClickEventOnScene(event: MouseEvent) {
        if (!this.clickMode) {
            return;
        }

        const locationId = this.clickMode.split(':').pop()!;

        const position = this.getPositionForEvent(event);

        let handleInputResult: boolean | Error = false;

        if (this.clickMode.startsWith('location:add:')) {
            handleInputResult = this.ui.handleInput(new LocationAddInputCommand(locationId, position));
        }
        else if (this.clickMode.startsWith('agent:add')) {
            handleInputResult = this.ui.handleInput(new AgentAddInputCommand(position));
        }

        if (handleInputResult instanceof Error) {
            this.domHoverElement.innerText = handleInputResult.message;
            return;
        }

        this.clickMode = undefined;
        this.processHoverEndEvent();
    }

    processClickEventOnObject(event: MouseEvent) {
        this.focusedObjectId = (event.target as Element)!.id;
        this.updateDetails();
    }

    getPositionForEvent(event: MouseEvent | PointerEvent): Position {
        const sceneRect = this.domElement.getBoundingClientRect();

        return {
            x: event.clientX - sceneRect.left,
            y: event.clientY - sceneRect.top,
        };
    }

    render(terrain: Terrain, locations: Location[], agents: Agent[], paths: Path[]) {
        this.domElement.style.width = `${terrain.x}px`;
        this.domElement.style.height = `${terrain.y}px`;

        if (this.domTerrainLayerElement.width !== terrain.x
            || this.domTerrainLayerElement.height !== terrain.y
        ) {
            UiScene.canvasReset(this.domTerrainLayerElement, terrain);
        }

        this.locationCache = locations;

        this.domRemoveObsoleteLocations(locations);
        this.domRemoveObsoleteAgents(agents);

        this.domUpdateLocations(locations);
        this.domUpdateAgents(agents);
        this.domUpdatePaths(paths);

        this.updateDetails();
    }

    domRemoveObsoleteLocations(locations: Location[]) {
        const domLocations = this.domElement.querySelectorAll('.building');
        const locationIds = locations.map((location) => {
            return `${this.domElementIdPrefix}${location.id}`;
        });

        domLocations.forEach((domLocation) => {
            if (!locationIds.includes(domLocation.id)) {
                domLocation.remove();
            }
        });
    }

    domRemoveObsoleteAgents(agents: Agent[]) {
        const domAgents = this.domElement.querySelectorAll('.agent');
        const agentIds = agents.map((agent) => {
            return agent.id;
        });

        domAgents.forEach((domAgent) => {
            if (!agentIds.includes(domAgent.id)) {
                domAgent.remove();
            }
        });
    }

    domUpdateLocations(locations: Location[]) {
        locations.forEach((building) => {
            const domBuilding = this.domEnsureElementForTyoe('building', building.id);

            this.domUpdateElementPosition(domBuilding, building.position);

            domBuilding.classList.add('building-' + building.type);
        });
    }

    domUpdateAgents(agents: Agent[]) {
        agents.forEach((agent) => {
            const domAgent = this.domEnsureElementForTyoe('agent', agent.id);

            this.domUpdateElementPosition(domAgent, agent.position);

            domAgent.classList.add('agent-state-' + (agent.job ? (agent.job.started ? 'packed' : 'busy') : 'idle'));
        });
    }

    domUpdatePaths(paths: Path[]) {
        const pathIds = paths.map((path) => {
            return path.id;
        });

        if (!UiScene.canvasIsRenderCacheOutdated(this.domTerrainLayerElement, pathIds)) {
            return;
        }

        UiScene.canvasReset(this.domTerrainLayerElement);

        const ctx = this.domTerrainLayerElement.getContext('2d')!;
        ctx.setLineDash([5, 15]);

        paths.forEach((path) => {
            ctx.beginPath();

            const pathStart = path.steps[0];

            if (!pathStart) {
                return;
            }

            ctx.moveTo(pathStart.x, pathStart.y);

            path.steps.forEach((step: Position, index: number) => {
                ctx.lineTo(step.x, step.y);
            });

            ctx.stroke();
            ctx.closePath();

            UiScene.canvasAddToRenderCache(this.domTerrainLayerElement, path.id);
        });
    }

    domEnsureElementForTyoe(type: string, id: string): HTMLDivElement {
        let element: HTMLDivElement | null = this.domObjectLayerElement.querySelector(`#${this.domElementIdPrefix}${id}`);

        if (!element) {
            element = this.domDocument.createElement('div');
            element.id = `${this.domElementIdPrefix}${id}`;

            this.domObjectLayerElement.appendChild(element);
        }

        // @ts-ignore
        element.classList.remove(...element.classList);
        element.classList.add(type);

        return element;
    }

    domUpdateElementPosition(element: HTMLDivElement, position: Position) {
        element.style.left = `${position.x}px`;
        element.style.top = `${position.y}px`;
    }

    updateDetails() {
        this.showDetails(this.focusedObjectId);
    }

    showDetails(id?: string) {
        if (!id) {
            this.uiDetails.render('');

            return;
        }

        const matchingLocation = this.locationCache.find((location) => {
            return `${this.domElementIdPrefix}${location.id}` === id;
        });

        if (!matchingLocation) {
            return;
        }

        const resourcesByType = {};

        matchingLocation.resources.forEach((resource) => {
            if (!resourcesByType[resource.type]) {
                resourcesByType[resource.type] = 0;
            }

            resourcesByType[resource.type]++;
        });

        const actions = matchingLocation.actions.map((action) => {
            return `<button data-locationid="${matchingLocation.id}" data-action="${action}">${action.toLocaleUpperCase()}</button>`;
        });

        this.uiDetails.render(`
            <dl>
                <dt>ID</dt>
                <dd>${matchingLocation.id}</dd>
                <dt>Type</dt>
                <dd>${matchingLocation.type}</dd>
                <dt>Resources (${matchingLocation.resources.length})</dt>
                <dd>${JSON.stringify(resourcesByType)}</dd>
                <dt>Actions</dt>
                <dd>${actions.join(' | ')}</dd>
            </dl>
        `);
    }

    static canvasReset(canvas: HTMLCanvasElement, terrain?: Terrain) {
        if (terrain) {
            canvas.width = terrain.x;
            canvas.height = terrain.y;
        } else {
            canvas.width = canvas.width;
            canvas.height = canvas.height;
        }
    }

    static canvasAddToRenderCache(canvas: HTMLCanvasElement, id: string): void {
        if (!canvas.dataset.renderCache) {
            canvas.dataset.renderCache = '';
        }

        const renderCache = canvas.dataset.renderCache.split(',');
        renderCache.push(id);

        canvas.dataset.renderCache = renderCache.join(',');
    }

    static canvasIsRenderCacheOutdated(canvas: HTMLCanvasElement, ids: Array<string>): boolean {
        if (!canvas.dataset.renderCache) {
            return true;
        }

        const renderCache = canvas.dataset.renderCache.split(',');

        return !(
            !difference(renderCache, ids).length
            || !difference(ids, renderCache).length
        );
    }
}
