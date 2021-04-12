/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkjs_agent"] = self["webpackChunkjs_agent"] || []).push([["engine"],{

/***/ "./engine/game.ts":
/*!************************!*\
  !*** ./engine/game.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nconst agent_manager_1 = __webpack_require__(/*! ./managers/agent-manager */ \"./engine/managers/agent-manager.ts\");\nconst job_manager_1 = __webpack_require__(/*! ./managers/job-manager */ \"./engine/managers/job-manager.ts\");\nconst location_manager_1 = __webpack_require__(/*! ./managers/location-manager */ \"./engine/managers/location-manager.ts\");\nconst order_manager_1 = __webpack_require__(/*! ./managers/order-manager */ \"./engine/managers/order-manager.ts\");\nconst agent_entity_1 = __webpack_require__(/*! ./objects/instances/entities/agent-entity */ \"./engine/objects/instances/entities/agent-entity.ts\");\nconst location_registry_1 = __webpack_require__(/*! ./registries/location-registry */ \"./engine/registries/location-registry.ts\");\nconst agent_repository_1 = __webpack_require__(/*! ./storage/agent-repository */ \"./engine/storage/agent-repository.ts\");\nconst job_repository_1 = __webpack_require__(/*! ./storage/job-repository */ \"./engine/storage/job-repository.ts\");\nconst location_repository_1 = __webpack_require__(/*! ./storage/location-repository */ \"./engine/storage/location-repository.ts\");\nconst orders_repository_1 = __webpack_require__(/*! ./storage/orders-repository */ \"./engine/storage/orders-repository.ts\");\nconst resource_repository_1 = __webpack_require__(/*! ./storage/resource-repository */ \"./engine/storage/resource-repository.ts\");\nclass Game {\n    constructor(settings, tickFunction) {\n        this.settings = Object.assign({\n            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest\n        }, settings);\n        this.outputHandler = undefined;\n        this.running = false;\n        this.locations = new location_repository_1.LocationRepository();\n        this.agents = new agent_repository_1.AgentRepository();\n        this.jobs = new job_repository_1.JobRepository();\n        this.resources = new resource_repository_1.ResourceRepository();\n        this.orders = new orders_repository_1.OrdersRepository();\n        this.tickFunction = tickFunction;\n    }\n    controlStart() {\n        if (this.running) {\n            return;\n        }\n        this.running = true;\n        this.scheduleMainLoop();\n    }\n    controlPause() {\n        if (!this.running) {\n            return;\n        }\n        this.running = false;\n        this.forcePublish();\n    }\n    mainLoop() {\n        if (!this.running) {\n            return;\n        }\n        this.process();\n        this.publish();\n        this.scheduleMainLoop();\n    }\n    scheduleMainLoop() {\n        this.tickFunction(() => {\n            this.mainLoop();\n        });\n    }\n    process() {\n        order_manager_1.OrderManager.process(this);\n        location_manager_1.LocationManager.process(this);\n        job_manager_1.JobManager.process(this);\n        agent_manager_1.AgentManager.process(this);\n    }\n    publish() {\n        var _a;\n        if (!this.outputHandler) {\n            return;\n        }\n        (_a = this.outputHandler) === null || _a === void 0 ? void 0 : _a.update({\n            running: this.running,\n            settings: {\n                locations: location_registry_1.LocationRegistry.getLocations(),\n            },\n            locations: this.locations.findAll(),\n            agents: this.agents.findAll(),\n            jobs: this.jobs.findAll(),\n            resources: this.resources.findAll(),\n            orders: this.orders.findAll(),\n        });\n    }\n    forcePublish() {\n        if (this.running) {\n            return;\n        }\n        this.publish();\n    }\n    setOutputHandler(outputHandler) {\n        this.outputHandler = outputHandler;\n        this.forcePublish();\n    }\n    command(inputCommand) {\n        switch (inputCommand.command) {\n            case 'control:start':\n                return this.controlStart();\n            case 'control:pause':\n                return this.controlPause();\n            case 'setting:update':\n                return this.updateSetting(inputCommand.data.key, inputCommand.data.value);\n            case 'gamestate:import':\n                return this.importState(inputCommand.data.state);\n            case 'gamestate:export':\n                return this.exportState();\n            case 'location:add:check':\n                return this.checkAddLocation(inputCommand.data);\n            case 'location:add':\n                return this.addLocation(inputCommand.data);\n            case 'agent:add':\n                return this.addAgent(inputCommand.data);\n            default:\n                throw new Error(`Unknown command \"${inputCommand.command}\"`);\n        }\n    }\n    checkAddLocation(data) {\n        const position = data.position;\n        if (position.x > 210 && position.x < 240) {\n            return new Error('INVALID_LOCATION');\n        }\n        return true;\n    }\n    addLocation(data) {\n        const check = this.checkAddLocation(data);\n        if (check instanceof Error) {\n            return check;\n        }\n        const position = data.position;\n        const location = location_registry_1.LocationRegistry.createLocation(data.id, position);\n        location.setGame(this);\n        this.locations.add(location);\n        location.onCreate();\n        this.forcePublish();\n        return location.id;\n    }\n    addAgent(data) {\n        const position = data.position;\n        const agent = new agent_entity_1.AgentEntity(position);\n        agent.setGame(this);\n        this.agents.add(agent);\n        this.forcePublish();\n        return agent.id;\n    }\n    addJob(job) {\n        job.setGame(this);\n        this.jobs.add(job);\n        return job.id;\n    }\n    addOrder(order) {\n        order.setGame(this);\n        this.orders.add(order);\n        return order.id;\n    }\n    updateSetting(key, value) {\n        let oldValue = this.settings[key];\n        this.settings[key] = value;\n        return {\n            oldValue: oldValue,\n            settings: this.settings,\n        };\n    }\n    exportState() {\n        this.controlPause();\n        return JSON.stringify({\n            settings: this.settings,\n            locations: this.locations.findAll(),\n            agents: this.agents.findAll(),\n            jobs: this.jobs.findAll(),\n            resources: this.resources.findAll(),\n            orders: this.orders.findAll(),\n        });\n    }\n    importState(state) {\n        this.controlPause();\n        const parsedState = JSON.parse(state);\n        console.log('TODO: importState', parsedState);\n        /*\n        this.settings = parsedState.settings;\n        this.locations = parsedState.locations;\n        this.agents = parsedState.agents;\n        this.jobs = parsedState.jobs;\n        this.resources = parsedState.resources;\n        */\n        this.controlStart();\n        return true;\n    }\n}\nexports.Game = Game;\n\n\n//# sourceURL=webpack://js-agent/./engine/game.ts?");

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

/***/ "./engine/managers/order-manager.ts":
/*!******************************************!*\
  !*** ./engine/managers/order-manager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OrderManager = void 0;\nconst job_1 = __webpack_require__(/*! ../objects/instances/job */ \"./engine/objects/instances/job.ts\");\nclass OrderManager {\n    static process(game) {\n        game.orders.findAll().forEach((order) => {\n            const location = order.getLocation();\n            if (!location) {\n                return;\n            }\n            order.forEachMissingResource((resourceClass, resourceDefinition) => {\n                const matchingResource = game.resources.findOneClosestByType(resourceDefinition.resource, location.position);\n                if (!matchingResource) {\n                    return undefined;\n                }\n                // @ts-ignore\n                const job = new job_1.Job(matchingResource.getLocation(), location, matchingResource);\n                matchingResource.assignToJob(job);\n                game.addJob(job);\n                return matchingResource;\n            });\n            if (order.isFulfilled()) {\n                game.orders.remove(order);\n            }\n        });\n    }\n}\nexports.OrderManager = OrderManager;\n\n\n//# sourceURL=webpack://js-agent/./engine/managers/order-manager.ts?");

/***/ }),

/***/ "./engine/objects/instance.ts":
/*!************************************!*\
  !*** ./engine/objects/instance.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Instance = void 0;\nconst uuid_1 = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/index.js\");\nclass Instance {\n    constructor() {\n        this.game = undefined;\n        this.id = uuid_1.v4();\n    }\n    toJSON() {\n        return {\n            id: this.id,\n            class: this.constructor.name\n        };\n    }\n    setGame(game) {\n        this.game = game;\n    }\n    getClonedInstance() {\n        const clonedInstance = Object.assign(Object.create(this), this);\n        clonedInstance.id = uuid_1.v4();\n        return clonedInstance;\n    }\n}\nexports.Instance = Instance;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instance.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/agent-entity.ts":
/*!***********************************************************!*\
  !*** ./engine/objects/instances/entities/agent-entity.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AgentEntity = void 0;\nconst position_1 = __webpack_require__(/*! ../../position */ \"./engine/objects/position.ts\");\nconst pathfinder_1 = __webpack_require__(/*! ../../util/pathfinder */ \"./engine/objects/util/pathfinder.ts\");\nconst entity_1 = __webpack_require__(/*! ../entity */ \"./engine/objects/instances/entity.ts\");\nclass AgentEntity extends entity_1.Entity {\n    constructor(position) {\n        super(position);\n        this.jobId = undefined;\n        this.velocityIdle = 5;\n        this.velocityJob = 1;\n    }\n    toJSON() {\n        return Object.assign(Object.assign({}, super.toJSON()), {\n            jobId: this.jobId,\n        });\n    }\n    process() {\n        super.process();\n        if (this.arrivedAtJobDestinationLocation()) {\n            return;\n        }\n        this.arrivedAtJobSourceLocation();\n        const job = this.getJob();\n        if (job) {\n            const jobTarget = job.getCurrentTargetLocation();\n            this.moveToTarget(jobTarget);\n        }\n    }\n    setJob(job) {\n        let assignedJob;\n        if (!job) {\n            assignedJob = this.getJob();\n            this.jobId = undefined;\n            if (assignedJob && assignedJob.getAgent() === this) {\n                assignedJob.setAgent(undefined);\n            }\n            return;\n        }\n        this.jobId = job.id;\n        assignedJob = this.getJob();\n        if (assignedJob && assignedJob.getAgent() !== this) {\n            assignedJob.setAgent(this);\n        }\n    }\n    getJob() {\n        var _a;\n        return this.jobId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.jobs.findOneById(this.jobId)\n            : undefined;\n    }\n    getSpeed() {\n        const job = this.getJob();\n        return (job && job.started)\n            ? this.velocityJob\n            : this.velocityIdle;\n    }\n    moveToTarget(target) {\n        this.position = pathfinder_1.Pathfinder.proceedToPosition(this.position, target.position, this.getSpeed());\n    }\n    arrivedAtJobDestinationLocation() {\n        var _a;\n        const job = this.getJob();\n        if (!job\n            || !job.started\n            || !position_1.Position.isSamePosition(this.position, job.destination.position)) {\n            return false;\n        }\n        job.finish();\n        (_a = this.game) === null || _a === void 0 ? void 0 : _a.jobs.remove(job);\n        this.jobId = undefined;\n        return true;\n    }\n    arrivedAtJobSourceLocation() {\n        const job = this.getJob();\n        if (!job) {\n            return false;\n        }\n        if (job.started) {\n            return true;\n        }\n        if (position_1.Position.isSamePosition(this.position, job.source.position)) {\n            job.start();\n        }\n        return job.started;\n    }\n}\nexports.AgentEntity = AgentEntity;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/agent-entity.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/location-entity.ts":
/*!**************************************************************!*\
  !*** ./engine/objects/instances/entities/location-entity.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LocationEntity = void 0;\nconst entity_1 = __webpack_require__(/*! ../entity */ \"./engine/objects/instances/entity.ts\");\nclass LocationEntity extends entity_1.Entity {\n    /**\n     * To be overwritten in locations.\n     */\n    onCreate() { }\n    onProcess() { }\n    process() {\n        super.process();\n        this.onProcess();\n    }\n    getResources() {\n        return this.game\n            ? this.game.resources.findByLocation(this)\n            : [];\n    }\n    createResource(resource) {\n        var _a;\n        this.attachResource(resource);\n        (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.add(resource);\n    }\n    attachResource(resource) {\n        resource.game = this.game;\n        resource.locationId = this.id;\n        resource.owner = 'location';\n    }\n    convertResources(inputResourcesDefinition, outputResourcesDefinition) {\n        const resources = this.getResources();\n        resources.forEach((resource) => {\n            inputResourcesDefinition.matchResource(resource);\n        });\n        if (inputResourcesDefinition.hasMissingResources()) {\n            return false;\n        }\n        inputResourcesDefinition.resetMatches();\n        resources.forEach((resource) => {\n            var _a;\n            if (inputResourcesDefinition.matchResource(resource)) {\n                (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.remove(resource);\n            }\n        });\n        Object.keys(outputResourcesDefinition.definitions).forEach((resourceClass) => {\n            while (outputResourcesDefinition.definitions[resourceClass].amountMatched < outputResourcesDefinition.definitions[resourceClass].amountRequested) {\n                this.createResource(outputResourcesDefinition.definitions[resourceClass].resource.getClonedInstance());\n                outputResourcesDefinition.definitions[resourceClass].amountMatched++;\n            }\n        });\n        return true;\n    }\n}\nexports.LocationEntity = LocationEntity;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/location-entity.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/locations/destination-busy.ts":
/*!*************************************************************************!*\
  !*** ./engine/objects/instances/entities/locations/destination-busy.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DestinationBusyLocation = void 0;\nconst destination_1 = __webpack_require__(/*! ./destination */ \"./engine/objects/instances/entities/locations/destination.ts\");\nclass DestinationBusyLocation extends destination_1.DestinationLocation {\n    constructor(...args) {\n        super(...args);\n        this.procesAfterTicks = 10;\n    }\n}\nexports.DestinationBusyLocation = DestinationBusyLocation;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/locations/destination-busy.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/locations/destination.ts":
/*!********************************************************************!*\
  !*** ./engine/objects/instances/entities/locations/destination.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DestinationLocation = void 0;\nconst resources_definition_1 = __webpack_require__(/*! ../../../util/resources-definition */ \"./engine/objects/util/resources-definition.ts\");\nconst order_1 = __webpack_require__(/*! ../../order */ \"./engine/objects/instances/order.ts\");\nconst item_a_1 = __webpack_require__(/*! ../../resources/item-a */ \"./engine/objects/instances/resources/item-a.ts\");\nconst item_b_1 = __webpack_require__(/*! ../../resources/item-b */ \"./engine/objects/instances/resources/item-b.ts\");\nconst location_entity_1 = __webpack_require__(/*! ../location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\nclass DestinationLocation extends location_entity_1.LocationEntity {\n    constructor(...args) {\n        // @ts-ignore\n        super(...args);\n        this.procesAfterTicks = 50;\n    }\n    onProcess() {\n        if (this.processTicks < this.procesAfterTicks) {\n            return;\n        }\n        this.resetProcessTicks();\n        this.convertResourcesIfPossible();\n        this.createOrderIfNotExists();\n    }\n    convertResourcesIfPossible() {\n        const inputResourcesDefinition = new resources_definition_1.ResourcesDefinition();\n        inputResourcesDefinition.addDefinition(new item_a_1.ItemA(), 5);\n        const outputResourcesDefinition = new resources_definition_1.ResourcesDefinition();\n        outputResourcesDefinition.addDefinition(new item_b_1.ItemB(), 2);\n        this.convertResources(inputResourcesDefinition, outputResourcesDefinition);\n    }\n    createOrderIfNotExists() {\n        var _a, _b;\n        if ((_a = this.game) === null || _a === void 0 ? void 0 : _a.orders.hasOpenOrderForLocation(this, 'default')) {\n            return;\n        }\n        const orderResourcesDefinition = new resources_definition_1.ResourcesDefinition();\n        orderResourcesDefinition.addDefinition(new item_a_1.ItemA(), 5);\n        const order = new order_1.Order(this, 'default', orderResourcesDefinition);\n        (_b = this.game) === null || _b === void 0 ? void 0 : _b.addOrder(order);\n    }\n}\nexports.DestinationLocation = DestinationLocation;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/locations/destination.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/locations/index.ts":
/*!**************************************************************!*\
  !*** ./engine/objects/instances/entities/locations/index.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst tslib_1 = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\ntslib_1.__exportStar(__webpack_require__(/*! ./destination-busy */ \"./engine/objects/instances/entities/locations/destination-busy.ts\"), exports);\ntslib_1.__exportStar(__webpack_require__(/*! ./destination */ \"./engine/objects/instances/entities/locations/destination.ts\"), exports);\ntslib_1.__exportStar(__webpack_require__(/*! ./source */ \"./engine/objects/instances/entities/locations/source.ts\"), exports);\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/locations/index.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/locations/source.ts":
/*!***************************************************************!*\
  !*** ./engine/objects/instances/entities/locations/source.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SourceLocation = void 0;\nconst item_a_1 = __webpack_require__(/*! ../../resources/item-a */ \"./engine/objects/instances/resources/item-a.ts\");\nconst location_entity_1 = __webpack_require__(/*! ../location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\nclass SourceLocation extends location_entity_1.LocationEntity {\n    onCreate() {\n        for (let index = 0; index < 10; index++) {\n            const resource = new item_a_1.ItemA();\n            resource.pickable = true;\n            this.createResource(resource);\n        }\n    }\n    onProcess() {\n        if (this.processTicks < 50\n            || this.getResources().length >= 20) {\n            return;\n        }\n        this.resetProcessTicks();\n        const resource = new item_a_1.ItemA();\n        resource.pickable = true;\n        this.createResource(resource);\n    }\n}\nexports.SourceLocation = SourceLocation;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/locations/source.ts?");

/***/ }),

/***/ "./engine/objects/instances/entity.ts":
/*!********************************************!*\
  !*** ./engine/objects/instances/entity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Entity = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Entity extends instance_1.Instance {\n    constructor(position) {\n        super();\n        this.position = position;\n        this.processTicks = 0;\n    }\n    toJSON() {\n        return Object.assign(Object.assign({}, super.toJSON()), {\n            position: this.position,\n        });\n    }\n    process() {\n        this.processTicks++;\n    }\n    resetProcessTicks() {\n        this.processTicks = 0;\n    }\n}\nexports.Entity = Entity;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entity.ts?");

/***/ }),

/***/ "./engine/objects/instances/job.ts":
/*!*****************************************!*\
  !*** ./engine/objects/instances/job.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Job = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Job extends instance_1.Instance {\n    constructor(source, destination, resource) {\n        super();\n        this.source = source;\n        this.destination = destination;\n        this.resourceId = resource ? resource.id : undefined;\n        this.agentId = undefined;\n        this.started = false;\n        this.finished = false;\n    }\n    toJSON() {\n        return Object.assign(Object.assign({}, super.toJSON()), {\n            source: this.source,\n            destination: this.destination,\n            resourceId: this.resourceId,\n            agentId: this.agentId,\n            started: this.started,\n            finished: this.finished,\n        });\n    }\n    setAgent(agent) {\n        let assignedAgent;\n        if (!agent) {\n            assignedAgent = this.getAgent();\n            this.agentId = undefined;\n            if (assignedAgent && assignedAgent.getJob() === this) {\n                assignedAgent.setJob(undefined);\n            }\n            return;\n        }\n        this.agentId = agent.id;\n        assignedAgent = this.getAgent();\n        if (assignedAgent && assignedAgent.jobId !== this.id) {\n            assignedAgent.setJob(this);\n        }\n    }\n    getAgent() {\n        var _a;\n        return this.agentId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.agents.findOneById(this.agentId)\n            : undefined;\n    }\n    getResource() {\n        var _a;\n        return this.resourceId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.findOneById(this.resourceId)\n            : undefined;\n    }\n    getCurrentTargetLocation() {\n        return this.started\n            ? this.destination\n            : this.source;\n    }\n    start() {\n        var _a;\n        if (this.started) {\n            return;\n        }\n        (_a = this.getResource()) === null || _a === void 0 ? void 0 : _a.assignToAgent();\n        this.started = true;\n    }\n    finish() {\n        var _a;\n        if (!this.started) {\n            return;\n        }\n        (_a = this.getResource()) === null || _a === void 0 ? void 0 : _a.assignToLocation(this.destination);\n        this.finished = true;\n    }\n}\nexports.Job = Job;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/job.ts?");

/***/ }),

/***/ "./engine/objects/instances/order.ts":
/*!*******************************************!*\
  !*** ./engine/objects/instances/order.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Order = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Order extends instance_1.Instance {\n    constructor(location, type, resourcesDefinition) {\n        super();\n        this.locationId = location.id;\n        this.type = type;\n        this.resourcesDefinition = resourcesDefinition;\n        this.resources = [];\n    }\n    toJSON() {\n        return Object.assign(Object.assign({}, super.toJSON()), {\n            locationId: this.locationId,\n            type: this.type,\n            resourcesDefinition: this.resourcesDefinition,\n            resources: this.resources,\n        });\n    }\n    isFulfilled() {\n        return !this.resourcesDefinition.hasMissingResources();\n    }\n    getLocation() {\n        var _a;\n        return (_a = this.game) === null || _a === void 0 ? void 0 : _a.locations.findOneById(this.locationId);\n    }\n    forEachMissingResource(callback) {\n        this.resourcesDefinition.forEachMissingResource((resourceClass, resourceDefinition) => {\n            /** @var Resource */\n            const resource = callback(resourceClass, resourceDefinition);\n            if (resource) {\n                this.assignResource(resource);\n            }\n        });\n    }\n    assignResource(resource) {\n        this.resources.push(resource.id);\n        this.resourcesDefinition.matchResource(resource);\n    }\n}\nexports.Order = Order;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/order.ts?");

/***/ }),

/***/ "./engine/objects/instances/resource.ts":
/*!**********************************************!*\
  !*** ./engine/objects/instances/resource.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Resource = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Resource extends instance_1.Instance {\n    constructor() {\n        super();\n        this.owner = 'location'; // location, agent\n        this.locationId = undefined;\n        this.jobId = undefined;\n        this.pickable = false;\n    }\n    toJSON() {\n        return Object.assign(Object.assign({}, super.toJSON()), {\n            owner: this.owner,\n            locationId: this.locationId,\n            jobId: this.jobId,\n            pickable: this.pickable,\n        });\n    }\n    getLocation() {\n        var _a;\n        return this.locationId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.locations.findOneById(this.locationId)\n            : undefined;\n    }\n    assignToLocation(location) {\n        this.locationId = location.id;\n        this.owner = 'location';\n        this.pickable = false;\n    }\n    assignToJob(job) {\n        this.jobId = job.id;\n        this.pickable = false;\n    }\n    assignToAgent() {\n        this.owner = 'agent';\n        this.pickable = false;\n    }\n}\nexports.Resource = Resource;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/resource.ts?");

/***/ }),

/***/ "./engine/objects/instances/resources/item-a.ts":
/*!******************************************************!*\
  !*** ./engine/objects/instances/resources/item-a.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ItemA = void 0;\nconst resource_1 = __webpack_require__(/*! ../resource */ \"./engine/objects/instances/resource.ts\");\nclass ItemA extends resource_1.Resource {\n}\nexports.ItemA = ItemA;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/resources/item-a.ts?");

/***/ }),

/***/ "./engine/objects/instances/resources/item-b.ts":
/*!******************************************************!*\
  !*** ./engine/objects/instances/resources/item-b.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ItemB = void 0;\nconst resource_1 = __webpack_require__(/*! ../resource */ \"./engine/objects/instances/resource.ts\");\nclass ItemB extends resource_1.Resource {\n}\nexports.ItemB = ItemB;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/resources/item-b.ts?");

/***/ }),

/***/ "./engine/objects/position.ts":
/*!************************************!*\
  !*** ./engine/objects/position.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Position = void 0;\nclass Position {\n    constructor(x, y) {\n        // @ts-ignore\n        this.x = parseInt(x, 10);\n        // @ts-ignore\n        this.y = parseInt(y, 10);\n    }\n    static findClosestEntity(position, entities) {\n        let closestDistance;\n        let closestEntity = undefined;\n        entities.forEach((entity) => {\n            const distance = this.getDistance(position.x, entity.position.x) + this.getDistance(position.y, entity.position.y);\n            if (!closestEntity || distance < closestDistance) {\n                closestEntity = entity;\n                closestDistance = distance;\n            }\n        });\n        return closestEntity;\n    }\n    static isSamePosition(source, destination) {\n        return (source.x === destination.x\n            && source.y === destination.y);\n    }\n    static getDistance(source, destination) {\n        return Math.abs(source - destination);\n    }\n}\nexports.Position = Position;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/position.ts?");

/***/ }),

/***/ "./engine/objects/util/pathfinder.ts":
/*!*******************************************!*\
  !*** ./engine/objects/util/pathfinder.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Pathfinder = void 0;\nconst position_1 = __webpack_require__(/*! ../position */ \"./engine/objects/position.ts\");\nclass Pathfinder {\n    static proceedToPosition(source, destination, speed) {\n        const x = this.proceedTowardsAxisValue(source.x, destination.x, speed);\n        const y = this.proceedTowardsAxisValue(source.y, destination.y, speed);\n        return new position_1.Position(x, y);\n    }\n    static proceedTowardsAxisValue(source, destination, speed) {\n        const distance = position_1.Position.getDistance(source, destination);\n        if (source > destination) {\n            return source - Math.min(distance, speed);\n        }\n        else if (source < destination) {\n            return source + Math.min(distance, speed);\n        }\n        else {\n            return source;\n        }\n    }\n}\nexports.Pathfinder = Pathfinder;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/util/pathfinder.ts?");

/***/ }),

/***/ "./engine/objects/util/resources-definition.ts":
/*!*****************************************************!*\
  !*** ./engine/objects/util/resources-definition.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ResourcesDefinition = void 0;\nclass ResourcesDefinition {\n    constructor() {\n        this.definitions = {};\n    }\n    addDefinition(resource, amount) {\n        this.definitions[resource.constructor.name] = {\n            resource: resource,\n            amountRequested: amount,\n            amountMatched: 0,\n        };\n    }\n    hasResource(resource) {\n        return this.definitions.hasOwnProperty(resource.constructor.name);\n    }\n    matchResource(resource) {\n        if (!this.hasResource(resource)) {\n            return false;\n        }\n        if (this.definitions[resource.constructor.name].amountMatched >= this.definitions[resource.constructor.name].amountRequested) {\n            return false;\n        }\n        this.definitions[resource.constructor.name].amountMatched++;\n        return true;\n    }\n    hasMissingResources() {\n        let hasMissingResources = false;\n        Object.keys(this.definitions).forEach((resourceClass) => {\n            if (this.definitions[resourceClass].amountMatched < this.definitions[resourceClass].amountRequested) {\n                hasMissingResources = true;\n            }\n        });\n        return hasMissingResources;\n    }\n    resetMatches() {\n        Object.keys(this.definitions).forEach((resourceClass) => {\n            this.definitions[resourceClass].amountMatched = 0;\n        });\n    }\n    forEachMissingResource(callback) {\n        Object.keys(this.definitions).forEach((resourceClass) => {\n            const amountDiff = this.definitions[resourceClass].amountRequested - this.definitions[resourceClass].amountMatched;\n            if (!amountDiff) {\n                return;\n            }\n            for (let index = 0; index < amountDiff; index++) {\n                callback(resourceClass, this.definitions[resourceClass]);\n            }\n        });\n    }\n}\nexports.ResourcesDefinition = ResourcesDefinition;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/util/resources-definition.ts?");

/***/ }),

/***/ "./engine/registries/location-registry.ts":
/*!************************************************!*\
  !*** ./engine/registries/location-registry.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LocationRegistry = void 0;\nconst Locations = __webpack_require__(/*! ../objects/instances/entities/locations */ \"./engine/objects/instances/entities/locations/index.ts\");\nclass LocationRegistry {\n    static createLocation(locationId, position) {\n        return new (Locations[locationId])(position);\n    }\n    static getLocations() {\n        return Object.keys(Locations).map((id) => {\n            return {\n                id,\n            };\n        });\n    }\n}\nexports.LocationRegistry = LocationRegistry;\n\n\n//# sourceURL=webpack://js-agent/./engine/registries/location-registry.ts?");

/***/ }),

/***/ "./engine/storage/agent-repository.ts":
/*!********************************************!*\
  !*** ./engine/storage/agent-repository.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AgentRepository = void 0;\nconst position_1 = __webpack_require__(/*! ../objects/position */ \"./engine/objects/position.ts\");\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nconst lodash_es_1 = __webpack_require__(/*! lodash-es */ \"./node_modules/lodash-es/lodash.js\");\nclass AgentRepository extends array_storage_1.ArrayStorage {\n    findIdle() {\n        return this.data.filter((agent) => {\n            return !agent.jobId;\n        });\n    }\n    findBusy() {\n        return this.data.filter((agent) => {\n            return !!agent.jobId;\n        });\n    }\n    findOneNextIdle() {\n        return this.data.find((agent) => {\n            return !agent.jobId;\n        });\n    }\n    findOneRandomIdle() {\n        const idleAgents = this.findIdle();\n        if (!idleAgents) {\n            return undefined;\n        }\n        const shuffledIdleAgents = lodash_es_1.shuffle(idleAgents);\n        return shuffledIdleAgents.shift();\n    }\n    findOneClosestIdle(position) {\n        const idleAgents = this.findIdle();\n        if (!idleAgents) {\n            return undefined;\n        }\n        // @ts-ignore\n        return position_1.Position.findClosestEntity(position, idleAgents);\n    }\n    hasIdle() {\n        return !!this.findIdle();\n    }\n}\nexports.AgentRepository = AgentRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/agent-repository.ts?");

/***/ }),

/***/ "./engine/storage/array-storage.ts":
/*!*****************************************!*\
  !*** ./engine/storage/array-storage.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ArrayStorage = void 0;\nclass ArrayStorage {\n    constructor() {\n        this.data = [];\n    }\n    add(item) {\n        this.data.push(item);\n    }\n    remove(item) {\n        const index = this.data.indexOf(item);\n        if (index === -1) {\n            return false;\n        }\n        this.data.splice(index, 1);\n        return true;\n    }\n    findOneById(id) {\n        return this.data.find((item) => {\n            return item.id === id;\n        });\n    }\n    findAll() {\n        return this.data;\n    }\n}\nexports.ArrayStorage = ArrayStorage;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/array-storage.ts?");

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

/***/ "./engine/storage/orders-repository.ts":
/*!*********************************************!*\
  !*** ./engine/storage/orders-repository.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OrdersRepository = void 0;\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nclass OrdersRepository extends array_storage_1.ArrayStorage {\n    findByLocation(location) {\n        return this.data.filter((order) => {\n            return order.locationId === location.id;\n        });\n    }\n    hasOpenOrderForLocation(location, type) {\n        return this.data.findIndex((order) => {\n            return (order.locationId === location.id\n                && order.type === type);\n        }) !== -1;\n    }\n}\nexports.OrdersRepository = OrdersRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/orders-repository.ts?");

/***/ }),

/***/ "./engine/storage/resource-repository.ts":
/*!***********************************************!*\
  !*** ./engine/storage/resource-repository.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ResourceRepository = void 0;\nconst position_1 = __webpack_require__(/*! ../objects/position */ \"./engine/objects/position.ts\");\nconst array_storage_1 = __webpack_require__(/*! ./array-storage */ \"./engine/storage/array-storage.ts\");\nclass ResourceRepository extends array_storage_1.ArrayStorage {\n    findByLocation(location) {\n        return this.data.filter((resource) => {\n            return (resource.owner === 'location'\n                && resource.locationId === location.id);\n        });\n    }\n    findOneClosestByType(type, position) {\n        const pickableResources = this.data.filter((resource) => {\n            return (resource.pickable\n                && resource.constructor.name === type.constructor.name);\n        });\n        if (!pickableResources.length) {\n            return undefined;\n        }\n        const locationIds = [];\n        const uniqueLocationResources = pickableResources.filter((resource) => {\n            if (!resource.locationId || locationIds.includes(resource.locationId)) {\n                return false;\n            }\n            locationIds.push(resource.locationId);\n            return true;\n        });\n        const possibleLocations = uniqueLocationResources.map((resource) => {\n            return resource.getLocation();\n        });\n        if (!possibleLocations.length) {\n            return undefined;\n        }\n        const possibleExistingLocations = possibleLocations.filter((location) => {\n            return !!location;\n        });\n        if (!possibleExistingLocations.length) {\n            return undefined;\n        }\n        // @ts-ignore\n        const closestLocation = position_1.Position.findClosestEntity(position, possibleExistingLocations);\n        if (!closestLocation) {\n            return undefined;\n        }\n        return uniqueLocationResources.find((resource) => {\n            return resource.locationId === (closestLocation === null || closestLocation === void 0 ? void 0 : closestLocation.id);\n        });\n    }\n}\nexports.ResourceRepository = ResourceRepository;\n\n\n//# sourceURL=webpack://js-agent/./engine/storage/resource-repository.ts?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./engine/game.ts"));
/******/ }
]);