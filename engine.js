/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkjs_agent"] = self["webpackChunkjs_agent"] || []).push([["engine"],{

/***/ "./engine/game.js":
/*!************************!*\
  !*** ./engine/game.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Game\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _managers_agent_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./managers/agent-manager */ \"./engine/managers/agent-manager.ts\");\n/* harmony import */ var _managers_job_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/job-manager */ \"./engine/managers/job-manager.ts\");\n/* harmony import */ var _managers_location_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/location-manager */ \"./engine/managers/location-manager.ts\");\n/* harmony import */ var _objects_instances_entities_agent_entity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/instances/entities/agent-entity */ \"./engine/objects/instances/entities/agent-entity.ts\");\n/* harmony import */ var _objects_instances_entities_location_entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/instances/entities/location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\n/* harmony import */ var _objects_instances_job__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/instances/job */ \"./engine/objects/instances/job.ts\");\n/* harmony import */ var _output_handler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./output-handler */ \"./engine/output-handler.ts\");\n/* harmony import */ var _storage_agent_repository__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./storage/agent-repository */ \"./engine/storage/agent-repository.ts\");\n/* harmony import */ var _storage_job_repository__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./storage/job-repository */ \"./engine/storage/job-repository.ts\");\n/* harmony import */ var _storage_location_repository__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./storage/location-repository */ \"./engine/storage/location-repository.ts\");\n/* harmony import */ var _storage_resource_repository__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./storage/resource-repository */ \"./engine/storage/resource-repository.ts\");\n/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash-es */ \"./node_modules/lodash-es/cloneDeepWith.js\");\n// @ts-check\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nclass Game {\n    /**\n     *\n     * @param {Object} settings\n     * @param {Function} tickFunction\n     */\n    constructor(settings, tickFunction) {\n        this.settings = {...{\n            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest\n        }, ...settings};\n        this.outputHandler = null;\n        this.running = false;\n        this.locations = new _storage_location_repository__WEBPACK_IMPORTED_MODULE_9__.LocationRepository();\n        this.agents = new _storage_agent_repository__WEBPACK_IMPORTED_MODULE_7__.AgentRepository();\n        this.jobs = new _storage_job_repository__WEBPACK_IMPORTED_MODULE_8__.JobRepository();\n        this.resources = new _storage_resource_repository__WEBPACK_IMPORTED_MODULE_10__.ResourceRepository();\n        this.tickFunction = tickFunction;\n    }\n\n    controlStart() {\n        console.log('game started');\n        this.running = true;\n        this.scheduleMainLoop();\n    }\n\n    controlPause() {\n        console.log('game paused');\n        this.running = false;\n    }\n\n    mainLoop() {\n        if (!this.running) {\n            return;\n        }\n\n        this.process();\n        this.publish();\n        this.scheduleMainLoop();\n    }\n\n    scheduleMainLoop() {\n        this.tickFunction(() => {\n            this.mainLoop();\n        });\n    }\n\n    process() {\n        _managers_location_manager__WEBPACK_IMPORTED_MODULE_2__.LocationManager.process(this);\n        _managers_job_manager__WEBPACK_IMPORTED_MODULE_1__.JobManager.process(this);\n        _managers_agent_manager__WEBPACK_IMPORTED_MODULE_0__.AgentManager.process(this);\n    }\n\n    publish() {\n        if (!this.outputHandler) {\n            return;\n        }\n\n        this.outputHandler.update(\n            this.locations.findAll(),\n            this.agents.findAll(),\n            this.jobs.findAll(),\n            this.resources.findAll()\n        );\n    }\n\n    forcePublish() {\n        if (this.running) {\n            return;\n        }\n\n        this.publish();\n    }\n\n    /**\n     *\n     * @param {OutputHandler} outputHandler\n     */\n    setOutputHandler(outputHandler) {\n        this.outputHandler = outputHandler;\n    }\n\n    /**\n     *\n     * @param {String} command\n     * @param {Object} data\n     */\n    command(command, data) {\n        switch (command) {\n            case 'control:start':\n                return this.controlStart();\n\n            case 'control:pause':\n                return this.controlPause();\n\n            case 'setting:update':\n                return this.updateSetting(data.key, data.value);\n\n            case 'gamestate:import':\n                return this.importState(data.state);\n\n            case 'gamestate:export':\n                return this.exportState();\n\n            case 'location:add':\n                return this.addLocation(data);\n\n            case 'agent:add':\n                return this.addAgent(data);\n\n            default:\n                throw new Error(`Unknown command \"${command}\"`);\n        }\n    }\n\n    /**\n     *\n     * @param {LocationEntity} location\n     * @returns {String}\n     */\n    addLocation(location) {\n        location.setGame(this);\n        this.locations.add(location);\n        location.onCreate();\n\n        this.forcePublish();\n\n        return location.id;\n    }\n\n    /**\n     *\n     * @param {AgentEntity} agent\n     * @returns {String}\n     */\n    addAgent(agent) {\n        agent.setGame(this);\n        this.agents.add(agent);\n\n        this.forcePublish();\n\n        return agent.id;\n    }\n\n    /**\n     *\n     * @param {Job} job\n     * @returns {String}\n     */\n    addJob(job) {\n        job.setGame(this);\n        this.jobs.add(job);\n\n        return job.id;\n    }\n\n    /**\n     *\n     * @param {String} key\n     * @param {String} value\n     * @returns {Object}\n     */\n    updateSetting(key, value) {\n        let oldValue = this.settings[key];\n\n        this.settings[key] = value;\n\n        return {\n            oldValue: oldValue,\n            settings: this.settings,\n        };\n    }\n\n    /**\n     *\n     * @returns {String}\n     */\n    exportState() {\n        this.controlPause();\n\n        const filterGame = (value, index, object, stack) => {\n            if (value instanceof Game) {\n                return null;\n            }\n\n            return undefined;\n        };\n\n        const state = {\n            settings: this.settings,\n            locations: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.locations.findAll(), filterGame),\n            agents: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.agents.findAll(), filterGame),\n            jobs: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.jobs.findAll(), filterGame),\n            resources: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.resources.findAll(), filterGame),\n        };\n\n        return JSON.stringify(state);\n    }\n\n    /**\n     *\n     * @param {String} state\n     * @returns {Boolean}\n     */\n    importState(state) {\n        this.controlPause();\n\n        /**\n         * @type {Object}\n         */\n        const parsedState = JSON.parse(state);\n\n        console.log('TODO: importState', parsedState);\n\n        /*\n        this.settings = parsedState.settings;\n        this.locations = parsedState.locations;\n        this.agents = parsedState.agents;\n        this.jobs = parsedState.jobs;\n        this.resources = parsedState.resources;\n        */\n\n        this.controlStart();\n\n        return true;\n    }\n}\n\n\n//# sourceURL=webpack://js-agent/./engine/game.js?");

/***/ }),

/***/ "./engine/managers/agent-manager.ts":
/*!******************************************!*\
  !*** ./engine/managers/agent-manager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AgentManager = void 0;\nclass AgentManager {\n    static process(game) {\n        game.agents.findBusy().forEach((agent) => {\n            agent.process();\n        });\n    }\n}\nexports.AgentManager = AgentManager;\n\n\n//# sourceURL=webpack://js-agent/./engine/managers/agent-manager.ts?");

/***/ }),

/***/ "./engine/managers/job-manager.ts":
/*!****************************************!*\
  !*** ./engine/managers/job-manager.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JobManager = void 0;\nclass JobManager {\n    static process(game) {\n        if (!game.agents.hasIdle() || !game.jobs.hasOpen()) {\n            return;\n        }\n        let openJob, idleAgent;\n        while ((openJob = game.jobs.findOneNextOpen())\n            && (idleAgent = this.findIdleAgentForOpenJob(game, openJob))) {\n            openJob.setAgent(idleAgent);\n        }\n    }\n    static findIdleAgentForOpenJob(game, openJob) {\n        switch (game.settings.assignIdleAgentToOpenJobStrategy) {\n            case 'next':\n                return game.agents.findOneNextIdle();\n            case 'random':\n                return game.agents.findOneRandomIdle();\n            case 'closest':\n                return game.agents.findOneClosestIdle(openJob.source.position);\n            default:\n                throw new Error(`Invalid value for assignIdleAgentToOpenJobStrategy: ${game.settings.assignIdleAgentToOpenJobStrategy}`);\n        }\n    }\n}\nexports.JobManager = JobManager;\n\n\n//# sourceURL=webpack://js-agent/./engine/managers/job-manager.ts?");

/***/ }),

/***/ "./engine/managers/location-manager.ts":
/*!*********************************************!*\
  !*** ./engine/managers/location-manager.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LocationManager = void 0;\nclass LocationManager {\n    static process(game) {\n        game.locations.findAll().forEach((location) => {\n            location.process();\n        });\n    }\n}\nexports.LocationManager = LocationManager;\n\n\n//# sourceURL=webpack://js-agent/./engine/managers/location-manager.ts?");

/***/ }),

/***/ "./engine/objects/instance.ts":
/*!************************************!*\
  !*** ./engine/objects/instance.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Instance = void 0;\nconst uuid_1 = __webpack_require__(/*! uuid */ \"./node_modules/uuid/index.js\");\nclass Instance {\n    constructor() {\n        this.game = undefined;\n        this.id = uuid_1.v4();\n    }\n    setGame(game) {\n        this.game = game;\n    }\n    getClonedInstance() {\n        const clonedInstance = Object.assign(Object.create(this), this);\n        clonedInstance.id = uuid_1.v4();\n        return clonedInstance;\n    }\n}\nexports.Instance = Instance;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instance.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/agent-entity.ts":
/*!***********************************************************!*\
  !*** ./engine/objects/instances/entities/agent-entity.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AgentEntity = void 0;\nconst entity_1 = __webpack_require__(/*! ../entity */ \"./engine/objects/instances/entity.ts\");\nclass AgentEntity extends entity_1.Entity {\n    constructor(position) {\n        super(position);\n        this.jobId = undefined;\n        this.velocityIdle = 5;\n        this.velocityJob = 1;\n    }\n    process() {\n        super.process();\n        if (this.arrivedAtJobDestinationLocation()) {\n            return;\n        }\n        this.arrivedAtJobSourceLocation();\n        let job = this.getJob();\n        if (job) {\n            const jobTarget = job.getCurrentTargetLocation();\n            this.moveToTarget(jobTarget);\n        }\n    }\n    setJob(job) {\n        let assignedJob;\n        if (!job) {\n            assignedJob = this.getJob();\n            this.jobId = undefined;\n            if (assignedJob && assignedJob.getAgent() === this) {\n                assignedJob.setAgent(null);\n            }\n            return;\n        }\n        this.jobId = job.id;\n        assignedJob = this.getJob();\n        if (assignedJob && assignedJob.getAgent() !== this) {\n            assignedJob.setAgent(this);\n        }\n    }\n    getJob() {\n        var _a;\n        return this.jobId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.jobs.findOneById(this.jobId) : null;\n    }\n    getSpeed() {\n        let job = this.getJob();\n        return (job && job.started)\n            ? this.velocityJob\n            : this.velocityIdle;\n    }\n    moveToTarget(target) {\n        let speed = this.getSpeed();\n        let distanceX = Math.abs(this.position.x - target.position.x);\n        let distanceY = Math.abs(this.position.y - target.position.y);\n        if (this.position.x > target.position.x) {\n            this.position.x = this.position.x - Math.min(distanceX, speed);\n        }\n        if (this.position.x < target.position.x) {\n            this.position.x = this.position.x + Math.min(distanceX, speed);\n        }\n        if (this.position.y > target.position.y) {\n            this.position.y = this.position.y - Math.min(distanceY, speed);\n        }\n        if (this.position.y < target.position.y) {\n            this.position.y = this.position.y + Math.min(distanceY, speed);\n        }\n    }\n    arrivedAtJobDestinationLocation() {\n        var _a;\n        let job = this.getJob();\n        if (!job || !job.started) {\n            return false;\n        }\n        if (this.position.x === job.destination.position.x\n            && this.position.y === job.destination.position.y) {\n            job.finish();\n            (_a = this.game) === null || _a === void 0 ? void 0 : _a.jobs.remove(job);\n            this.jobId = undefined;\n            return true;\n        }\n        return false;\n    }\n    arrivedAtJobSourceLocation() {\n        let job = this.getJob();\n        if (!job) {\n            return false;\n        }\n        if (job.started) {\n            return true;\n        }\n        if (this.position.x === job.source.position.x\n            && this.position.y === job.source.position.y) {\n            job.start();\n        }\n        return job.started;\n    }\n}\nexports.AgentEntity = AgentEntity;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/agent-entity.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/location-entity.ts":
/*!**************************************************************!*\
  !*** ./engine/objects/instances/entities/location-entity.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LocationEntity = void 0;\nconst entity_1 = __webpack_require__(/*! ../entity */ \"./engine/objects/instances/entity.ts\");\nclass LocationEntity extends entity_1.Entity {\n    /**\n     * To be overwritten in locations.\n     */\n    onCreate() { }\n    onProcess() { }\n    process() {\n        super.process();\n        this.onProcess();\n    }\n    getResources() {\n        return this.game\n            ? this.game.resources.findByLocation(this)\n            : [];\n    }\n    createResource(resource) {\n        var _a;\n        this.attachResource(resource);\n        (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.add(resource);\n    }\n    attachResource(resource) {\n        resource.game = this.game;\n        resource.locationId = this.id;\n        resource.owner = 'location';\n    }\n    convertResources(inputResourcesDefinition, outputResourcesDefinition) {\n        const resources = this.getResources();\n        resources.forEach((resource) => {\n            inputResourcesDefinition.matchResource(resource);\n        });\n        if (inputResourcesDefinition.hasMissingResources()) {\n            return false;\n        }\n        inputResourcesDefinition.resetMatches();\n        resources.forEach((resource) => {\n            var _a;\n            if (inputResourcesDefinition.matchResource(resource)) {\n                (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.remove(resource);\n            }\n        });\n        Object.keys(outputResourcesDefinition.definitions).forEach((resourceClass) => {\n            while (outputResourcesDefinition.definitions[resourceClass].amountMatched < outputResourcesDefinition.definitions[resourceClass].amountRequested) {\n                this.createResource(outputResourcesDefinition.definitions[resourceClass].resource.getClonedInstance());\n                outputResourcesDefinition.definitions[resourceClass].amountMatched++;\n            }\n        });\n        return true;\n    }\n}\nexports.LocationEntity = LocationEntity;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/location-entity.ts?");

/***/ }),

/***/ "./engine/objects/instances/entity.ts":
/*!********************************************!*\
  !*** ./engine/objects/instances/entity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Entity = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Entity extends instance_1.Instance {\n    constructor(position) {\n        super();\n        this.position = position;\n        this.processTicks = 0;\n    }\n    process() {\n        this.processTicks++;\n    }\n    resetProcessTicks() {\n        this.processTicks = 0;\n    }\n}\nexports.Entity = Entity;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entity.ts?");

/***/ }),

/***/ "./engine/objects/instances/job.ts":
/*!*****************************************!*\
  !*** ./engine/objects/instances/job.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Job = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Job extends instance_1.Instance {\n    constructor(source, destination, resource) {\n        super();\n        this.source = source;\n        this.destination = destination;\n        this.resourceId = resource ? resource.id : undefined;\n        this.agentId = undefined;\n        this.started = false;\n        this.finished = false;\n    }\n    setAgent(agent) {\n        let assignedAgent;\n        if (!agent) {\n            assignedAgent = this.getAgent();\n            this.agentId = undefined;\n            if (assignedAgent && assignedAgent.getJob() === this) {\n                assignedAgent.setJob(null);\n            }\n            return;\n        }\n        this.agentId = agent.id;\n        assignedAgent = this.getAgent();\n        if (assignedAgent && assignedAgent.jobId !== this.id) {\n            assignedAgent.setJob(this);\n        }\n    }\n    getAgent() {\n        var _a;\n        return this.agentId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.agents.findOneById(this.agentId) : undefined;\n    }\n    getResource() {\n        var _a;\n        return this.resourceId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.findOneById(this.resourceId) : undefined;\n    }\n    getCurrentTargetLocation() {\n        return this.started\n            ? this.destination\n            : this.source;\n    }\n    start() {\n        var _a;\n        if (this.started) {\n            return;\n        }\n        (_a = this.getResource()) === null || _a === void 0 ? void 0 : _a.assignToAgent();\n        this.started = true;\n    }\n    finish() {\n        var _a;\n        if (!this.started) {\n            return;\n        }\n        (_a = this.getResource()) === null || _a === void 0 ? void 0 : _a.assignToLocation(this.destination);\n        this.finished = true;\n    }\n}\nexports.Job = Job;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/job.ts?");

/***/ }),

/***/ "./engine/objects/position.ts":
/*!************************************!*\
  !*** ./engine/objects/position.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Position = void 0;\nclass Position {\n    constructor(x, y) {\n        this.x = parseInt(x, 10);\n        this.y = parseInt(y, 10);\n    }\n    static findClosestEntity(position, entities) {\n        let closestDistance;\n        let closestEntity = undefined;\n        entities.forEach((entity) => {\n            let distance = Math.abs(position.x - entity.position.x) + Math.abs(position.y - entity.position.y);\n            if (!closestEntity || distance < closestDistance) {\n                closestEntity = entity;\n                closestDistance = distance;\n            }\n        });\n        return closestEntity;\n    }\n}\nexports.Position = Position;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/position.ts?");

/***/ }),

/***/ "./engine/output-handler.ts":
/*!**********************************!*\
  !*** ./engine/output-handler.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OutputHandler = void 0;\nclass OutputHandler {\n    constructor(game, ui) {\n        game.setOutputHandler(this);\n        this.ui = ui;\n    }\n    update(...args) {\n        // @ts-ignore\n        this.ui.updateState(...args);\n    }\n}\nexports.OutputHandler = OutputHandler;\n\n\n//# sourceURL=webpack://js-agent/./engine/output-handler.ts?");

/***/ }),

/***/ "./engine/storage/agent-repository.ts":
/*!********************************************!*\
  !*** ./engine/storage/agent-repository.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AgentRepository = void 0;\nconst position_1 = __webpack_require__(/*! ../objects/position */ \"./engine/objects/position.ts\");\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nconst lodash_es_1 = __webpack_require__(/*! lodash-es */ \"./node_modules/lodash-es/lodash.js\");\nclass AgentRepository extends array_storage_1.ArrayStorage {\n    findIdle() {\n        return this.data.filter((agent) => {\n            return !agent.jobId;\n        });\n    }\n    findBusy() {\n        return this.data.filter((agent) => {\n            return !!agent.jobId;\n        });\n    }\n    findOneNextIdle() {\n        return this.data.find((agent) => {\n            return !agent.jobId;\n        });\n    }\n    findOneRandomIdle() {\n        let idleAgents = this.findIdle();\n        if (!idleAgents) {\n            return undefined;\n        }\n        let shuffledIdleAgents = lodash_es_1.shuffle(idleAgents);\n        return shuffledIdleAgents.shift();\n    }\n    findOneClosestIdle(position) {\n        let idleAgents = this.findIdle();\n        if (!idleAgents) {\n            return undefined;\n        }\n        // @ts-ignore\n        return position_1.Position.findClosestEntity(position, idleAgents);\n    }\n    hasIdle() {\n        return !!this.findIdle();\n    }\n}\nexports.AgentRepository = AgentRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/agent-repository.ts?");

/***/ }),

/***/ "./engine/storage/array-storage.ts":
/*!*****************************************!*\
  !*** ./engine/storage/array-storage.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ArrayStorage = void 0;\nclass ArrayStorage {\n    constructor() {\n        this.data = [];\n    }\n    add(item) {\n        this.data.push(item);\n    }\n    remove(item) {\n        let index = this.data.indexOf(item);\n        if (index === -1) {\n            return false;\n        }\n        this.data.splice(index, 1);\n        return true;\n    }\n    findOneById(id) {\n        return this.data.find((item) => {\n            return item.id === id;\n        });\n    }\n    findAll() {\n        return this.data;\n    }\n}\nexports.ArrayStorage = ArrayStorage;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/array-storage.ts?");

/***/ }),

/***/ "./engine/storage/job-repository.ts":
/*!******************************************!*\
  !*** ./engine/storage/job-repository.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JobRepository = void 0;\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nclass JobRepository extends array_storage_1.ArrayStorage {\n    remove(job) {\n        job.setAgent(undefined);\n        return super.remove(job);\n    }\n    findOpen() {\n        return this.data.filter((job) => {\n            return !job.agentId;\n        });\n    }\n    findOneNextOpen() {\n        return this.data.find((job) => {\n            return !job.agentId;\n        });\n    }\n    hasOpen() {\n        return !!this.findOpen();\n    }\n}\nexports.JobRepository = JobRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/job-repository.ts?");

/***/ }),

/***/ "./engine/storage/location-repository.ts":
/*!***********************************************!*\
  !*** ./engine/storage/location-repository.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LocationRepository = void 0;\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nclass LocationRepository extends array_storage_1.ArrayStorage {\n}\nexports.LocationRepository = LocationRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/location-repository.ts?");

/***/ }),

/***/ "./engine/storage/resource-repository.ts":
/*!***********************************************!*\
  !*** ./engine/storage/resource-repository.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ResourceRepository = void 0;\nconst position_1 = __webpack_require__(/*! ../objects/position */ \"./engine/objects/position.ts\");\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nclass ResourceRepository extends array_storage_1.ArrayStorage {\n    findByLocation(location) {\n        return this.data.filter((resource) => {\n            return (resource.owner === 'location'\n                && resource.locationId === location.id);\n        });\n    }\n    findOneClosestByType(type, position) {\n        let pickableResources = this.data.filter((resource) => {\n            return (resource.pickable\n                && resource.constructor.name === type.constructor.name);\n        });\n        if (!pickableResources.length) {\n            return undefined;\n        }\n        let locationIds = [];\n        let uniqueLocationResources = pickableResources.filter((resource) => {\n            if (!resource.locationId || locationIds.includes(resource.locationId)) {\n                return false;\n            }\n            locationIds.push(resource.locationId);\n            return true;\n        });\n        let possibleLocations = uniqueLocationResources.map((resource) => {\n            return resource.getLocation();\n        });\n        if (!possibleLocations.length) {\n            return undefined;\n        }\n        possibleLocations = possibleLocations.filter((location) => {\n            return !!location;\n        });\n        if (!possibleLocations.length) {\n            return undefined;\n        }\n        // @ts-ignore\n        let closestLocation = position_1.Position.findClosestEntity(position, possibleLocations);\n        if (!closestLocation) {\n            return undefined;\n        }\n        return uniqueLocationResources.find((resource) => {\n            return resource.locationId === (closestLocation === null || closestLocation === void 0 ? void 0 : closestLocation.id);\n        });\n    }\n}\nexports.ResourceRepository = ResourceRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/resource-repository.ts?");

/***/ })

},
0,[["./engine/game.js","vendor"]]]);