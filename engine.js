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
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nconst agent_manager_1 = __webpack_require__(/*! ./managers/agent-manager */ \"./engine/managers/agent-manager.ts\");\nconst job_manager_1 = __webpack_require__(/*! ./managers/job-manager */ \"./engine/managers/job-manager.ts\");\nconst location_manager_1 = __webpack_require__(/*! ./managers/location-manager */ \"./engine/managers/location-manager.ts\");\nconst order_manager_1 = __webpack_require__(/*! ./managers/order-manager */ \"./engine/managers/order-manager.ts\");\nconst agent_repository_1 = __webpack_require__(/*! ./storage/agent-repository */ \"./engine/storage/agent-repository.ts\");\nconst job_repository_1 = __webpack_require__(/*! ./storage/job-repository */ \"./engine/storage/job-repository.ts\");\nconst location_repository_1 = __webpack_require__(/*! ./storage/location-repository */ \"./engine/storage/location-repository.ts\");\nconst orders_repository_1 = __webpack_require__(/*! ./storage/orders-repository */ \"./engine/storage/orders-repository.ts\");\nconst resource_repository_1 = __webpack_require__(/*! ./storage/resource-repository */ \"./engine/storage/resource-repository.ts\");\nclass Game {\n    constructor(settings, tickFunction) {\n        this.settings = Object.assign({\n            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest\n        }, settings);\n        this.outputHandler = undefined;\n        this.running = false;\n        this.locations = new location_repository_1.LocationRepository();\n        this.agents = new agent_repository_1.AgentRepository();\n        this.jobs = new job_repository_1.JobRepository();\n        this.resources = new resource_repository_1.ResourceRepository();\n        this.orders = new orders_repository_1.OrdersRepository();\n        this.tickFunction = tickFunction;\n    }\n    controlStart() {\n        if (this.running) {\n            return;\n        }\n        this.running = true;\n        this.scheduleMainLoop();\n    }\n    controlPause() {\n        if (!this.running) {\n            return;\n        }\n        this.running = false;\n        this.forcePublish();\n    }\n    mainLoop() {\n        if (!this.running) {\n            return;\n        }\n        this.process();\n        this.publish();\n        this.scheduleMainLoop();\n    }\n    scheduleMainLoop() {\n        this.tickFunction(() => {\n            this.mainLoop();\n        });\n    }\n    process() {\n        order_manager_1.OrderManager.process(this);\n        location_manager_1.LocationManager.process(this);\n        job_manager_1.JobManager.process(this);\n        agent_manager_1.AgentManager.process(this);\n    }\n    publish() {\n        var _a;\n        if (!this.outputHandler) {\n            return;\n        }\n        (_a = this.outputHandler) === null || _a === void 0 ? void 0 : _a.update(this.running, this.locations.findAll(), this.agents.findAll(), this.jobs.findAll(), this.resources.findAll(), this.orders.findAll());\n    }\n    forcePublish() {\n        if (this.running) {\n            return;\n        }\n        this.publish();\n    }\n    setOutputHandler(outputHandler) {\n        this.outputHandler = outputHandler;\n    }\n    command(command, data) {\n        switch (command) {\n            case 'control:start':\n                return this.controlStart();\n            case 'control:pause':\n                return this.controlPause();\n            case 'setting:update':\n                return this.updateSetting(data.key, data.value);\n            case 'gamestate:import':\n                return this.importState(data.state);\n            case 'gamestate:export':\n                return this.exportState();\n            case 'location:add':\n                return this.addLocation(data);\n            case 'agent:add':\n                return this.addAgent(data);\n            default:\n                throw new Error(`Unknown command \"${command}\"`);\n        }\n    }\n    addLocation(location) {\n        location.setGame(this);\n        this.locations.add(location);\n        location.onCreate();\n        this.forcePublish();\n        return location.id;\n    }\n    addAgent(agent) {\n        agent.setGame(this);\n        this.agents.add(agent);\n        this.forcePublish();\n        return agent.id;\n    }\n    addJob(job) {\n        job.setGame(this);\n        this.jobs.add(job);\n        return job.id;\n    }\n    addOrder(order) {\n        order.setGame(this);\n        this.orders.add(order);\n        return order.id;\n    }\n    updateSetting(key, value) {\n        let oldValue = this.settings[key];\n        this.settings[key] = value;\n        return {\n            oldValue: oldValue,\n            settings: this.settings,\n        };\n    }\n    exportState() {\n        this.controlPause();\n        return JSON.stringify({\n            settings: this.settings,\n            locations: this.locations.findAll(),\n            agents: this.agents.findAll(),\n            jobs: this.jobs.findAll(),\n            resources: this.resources.findAll(),\n            orders: this.orders.findAll(),\n        });\n    }\n    importState(state) {\n        this.controlPause();\n        const parsedState = JSON.parse(state);\n        console.log('TODO: importState', parsedState);\n        /*\n        this.settings = parsedState.settings;\n        this.locations = parsedState.locations;\n        this.agents = parsedState.agents;\n        this.jobs = parsedState.jobs;\n        this.resources = parsedState.resources;\n        */\n        this.controlStart();\n        return true;\n    }\n}\nexports.Game = Game;\n\n\n//# sourceURL=webpack://js-agent/./engine/game.ts?");

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

/***/ "./engine/objects/instances/job.ts":
/*!*****************************************!*\
  !*** ./engine/objects/instances/job.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Job = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Job extends instance_1.Instance {\n    constructor(source, destination, resource) {\n        super();\n        this.source = source;\n        this.destination = destination;\n        this.resourceId = resource ? resource.id : undefined;\n        this.agentId = undefined;\n        this.started = false;\n        this.finished = false;\n    }\n    toJSON() {\n        return Object.assign(Object.assign({}, super.toJSON()), {\n            source: this.source,\n            destination: this.destination,\n            resourceId: this.resourceId,\n            agentId: this.agentId,\n            started: this.started,\n            finished: this.finished,\n        });\n    }\n    setAgent(agent) {\n        let assignedAgent;\n        if (!agent) {\n            assignedAgent = this.getAgent();\n            this.agentId = undefined;\n            if (assignedAgent && assignedAgent.getJob() === this) {\n                assignedAgent.setJob(undefined);\n            }\n            return;\n        }\n        this.agentId = agent.id;\n        assignedAgent = this.getAgent();\n        if (assignedAgent && assignedAgent.jobId !== this.id) {\n            assignedAgent.setJob(this);\n        }\n    }\n    getAgent() {\n        var _a;\n        return this.agentId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.agents.findOneById(this.agentId)\n            : undefined;\n    }\n    getResource() {\n        var _a;\n        return this.resourceId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.findOneById(this.resourceId)\n            : undefined;\n    }\n    getCurrentTargetLocation() {\n        return this.started\n            ? this.destination\n            : this.source;\n    }\n    start() {\n        var _a;\n        if (this.started) {\n            return;\n        }\n        (_a = this.getResource()) === null || _a === void 0 ? void 0 : _a.assignToAgent();\n        this.started = true;\n    }\n    finish() {\n        var _a;\n        if (!this.started) {\n            return;\n        }\n        (_a = this.getResource()) === null || _a === void 0 ? void 0 : _a.assignToLocation(this.destination);\n        this.finished = true;\n    }\n}\nexports.Job = Job;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/job.ts?");

/***/ }),

/***/ "./engine/objects/position.ts":
/*!************************************!*\
  !*** ./engine/objects/position.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Position = void 0;\nclass Position {\n    constructor(x, y) {\n        // @ts-ignore\n        this.x = parseInt(x, 10);\n        // @ts-ignore\n        this.y = parseInt(y, 10);\n    }\n    static findClosestEntity(position, entities) {\n        let closestDistance;\n        let closestEntity = undefined;\n        entities.forEach((entity) => {\n            const distance = this.getDistance(position.x, entity.position.x) + this.getDistance(position.y, entity.position.y);\n            if (!closestEntity || distance < closestDistance) {\n                closestEntity = entity;\n                closestDistance = distance;\n            }\n        });\n        return closestEntity;\n    }\n    static isSamePosition(source, destination) {\n        return (source.x === destination.x\n            && source.y === destination.y);\n    }\n    static getDistance(source, destination) {\n        return Math.abs(source - destination);\n    }\n}\nexports.Position = Position;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/position.ts?");

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