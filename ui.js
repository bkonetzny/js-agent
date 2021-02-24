/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkjs_agent"] = self["webpackChunkjs_agent"] || []).push([["ui"],{

/***/ "./engine/game.js":
/*!************************!*\
  !*** ./engine/game.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Game\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _managers_agent_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./managers/agent-manager */ \"./engine/managers/agent-manager.ts\");\n/* harmony import */ var _managers_job_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/job-manager */ \"./engine/managers/job-manager.ts\");\n/* harmony import */ var _managers_location_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/location-manager */ \"./engine/managers/location-manager.ts\");\n/* harmony import */ var _objects_instances_entities_agent_entity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/instances/entities/agent-entity */ \"./engine/objects/instances/entities/agent-entity.ts\");\n/* harmony import */ var _objects_instances_entities_location_entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/instances/entities/location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\n/* harmony import */ var _objects_instances_job__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/instances/job */ \"./engine/objects/instances/job.ts\");\n/* harmony import */ var _output_handler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./output-handler */ \"./engine/output-handler.ts\");\n/* harmony import */ var _storage_agent_repository__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./storage/agent-repository */ \"./engine/storage/agent-repository.ts\");\n/* harmony import */ var _storage_job_repository__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./storage/job-repository */ \"./engine/storage/job-repository.ts\");\n/* harmony import */ var _storage_location_repository__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./storage/location-repository */ \"./engine/storage/location-repository.ts\");\n/* harmony import */ var _storage_resource_repository__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./storage/resource-repository */ \"./engine/storage/resource-repository.ts\");\n/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash-es */ \"./node_modules/lodash-es/cloneDeepWith.js\");\n// @ts-check\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nclass Game {\n    /**\n     *\n     * @param {Object} settings\n     * @param {Function} tickFunction\n     */\n    constructor(settings, tickFunction) {\n        this.settings = {...{\n            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest\n        }, ...settings};\n        this.outputHandler = null;\n        this.running = false;\n        this.locations = new _storage_location_repository__WEBPACK_IMPORTED_MODULE_9__.LocationRepository();\n        this.agents = new _storage_agent_repository__WEBPACK_IMPORTED_MODULE_7__.AgentRepository();\n        this.jobs = new _storage_job_repository__WEBPACK_IMPORTED_MODULE_8__.JobRepository();\n        this.resources = new _storage_resource_repository__WEBPACK_IMPORTED_MODULE_10__.ResourceRepository();\n        this.tickFunction = tickFunction;\n    }\n\n    controlStart() {\n        console.log('game started');\n        this.running = true;\n        this.scheduleMainLoop();\n    }\n\n    controlPause() {\n        console.log('game paused');\n        this.running = false;\n    }\n\n    mainLoop() {\n        if (!this.running) {\n            return;\n        }\n\n        this.process();\n        this.publish();\n        this.scheduleMainLoop();\n    }\n\n    scheduleMainLoop() {\n        this.tickFunction(() => {\n            this.mainLoop();\n        });\n    }\n\n    process() {\n        _managers_location_manager__WEBPACK_IMPORTED_MODULE_2__.LocationManager.process(this);\n        _managers_job_manager__WEBPACK_IMPORTED_MODULE_1__.JobManager.process(this);\n        _managers_agent_manager__WEBPACK_IMPORTED_MODULE_0__.AgentManager.process(this);\n    }\n\n    publish() {\n        if (!this.outputHandler) {\n            return;\n        }\n\n        this.outputHandler.update(\n            this.locations.findAll(),\n            this.agents.findAll(),\n            this.jobs.findAll(),\n            this.resources.findAll()\n        );\n    }\n\n    forcePublish() {\n        if (this.running) {\n            return;\n        }\n\n        this.publish();\n    }\n\n    /**\n     *\n     * @param {OutputHandler} outputHandler\n     */\n    setOutputHandler(outputHandler) {\n        this.outputHandler = outputHandler;\n    }\n\n    /**\n     *\n     * @param {String} command\n     * @param {Object} data\n     */\n    command(command, data) {\n        switch (command) {\n            case 'control:start':\n                return this.controlStart();\n\n            case 'control:pause':\n                return this.controlPause();\n\n            case 'setting:update':\n                return this.updateSetting(data.key, data.value);\n\n            case 'gamestate:import':\n                return this.importState(data.state);\n\n            case 'gamestate:export':\n                return this.exportState();\n\n            case 'location:add':\n                return this.addLocation(data);\n\n            case 'agent:add':\n                return this.addAgent(data);\n\n            default:\n                throw new Error(`Unknown command \"${command}\"`);\n        }\n    }\n\n    /**\n     *\n     * @param {LocationEntity} location\n     * @returns {String}\n     */\n    addLocation(location) {\n        location.setGame(this);\n        this.locations.add(location);\n        location.onCreate();\n\n        this.forcePublish();\n\n        return location.id;\n    }\n\n    /**\n     *\n     * @param {AgentEntity} agent\n     * @returns {String}\n     */\n    addAgent(agent) {\n        agent.setGame(this);\n        this.agents.add(agent);\n\n        this.forcePublish();\n\n        return agent.id;\n    }\n\n    /**\n     *\n     * @param {Job} job\n     * @returns {String}\n     */\n    addJob(job) {\n        job.setGame(this);\n        this.jobs.add(job);\n\n        return job.id;\n    }\n\n    /**\n     *\n     * @param {String} key\n     * @param {String} value\n     * @returns {Object}\n     */\n    updateSetting(key, value) {\n        let oldValue = this.settings[key];\n\n        this.settings[key] = value;\n\n        return {\n            oldValue: oldValue,\n            settings: this.settings,\n        };\n    }\n\n    /**\n     *\n     * @returns {String}\n     */\n    exportState() {\n        this.controlPause();\n\n        const filterGame = (value, index, object, stack) => {\n            if (value instanceof Game) {\n                return null;\n            }\n\n            return undefined;\n        };\n\n        const state = {\n            settings: this.settings,\n            locations: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.locations.findAll(), filterGame),\n            agents: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.agents.findAll(), filterGame),\n            jobs: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.jobs.findAll(), filterGame),\n            resources: (0,lodash_es__WEBPACK_IMPORTED_MODULE_11__.default)(this.resources.findAll(), filterGame),\n        };\n\n        return JSON.stringify(state);\n    }\n\n    /**\n     *\n     * @param {String} state\n     * @returns {Boolean}\n     */\n    importState(state) {\n        this.controlPause();\n\n        /**\n         * @type {Object}\n         */\n        const parsedState = JSON.parse(state);\n\n        console.log('TODO: importState', parsedState);\n\n        /*\n        this.settings = parsedState.settings;\n        this.locations = parsedState.locations;\n        this.agents = parsedState.agents;\n        this.jobs = parsedState.jobs;\n        this.resources = parsedState.resources;\n        */\n\n        this.controlStart();\n\n        return true;\n    }\n}\n\n\n//# sourceURL=webpack://js-agent/./engine/game.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./ui/styles/scene.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./ui/styles/scene.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);\n// Imports\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \"#scene {\\n    background: #fff;\\n    margin: 10px;\\n    width: 500px;\\n    height: 400px;\\n    position: relative;\\n}\\n\\n#scene > div {\\n    position: absolute;\\n}\\n\\n.building {\\n    z-index: 0;\\n    background-color: yellow;\\n    width: 40px;\\n    height: 40px;\\n}\\n\\n.building-SourceLocation {\\n    background-color: green;\\n}\\n\\n.building-DestinationLocation {\\n    background-color: blueviolet;\\n}\\n\\n.building-DestinationBusyLocation {\\n    background-color: orange;\\n}\\n\\n.agent {\\n    z-index: 1;\\n    width: 20px;\\n    height: 20px;\\n    font-size: 20px;\\n    transition-property: left, top;\\n    transition-duration: 100ms;\\n    transition-timing-function: linear;\\n}\\n\\n.agent:before {\\n    font-size: 20px;\\n}\\n\\n.agent-state-idle:before {\\n    content: '😴';\\n}\\n\\n.agent-state-busy:before {\\n    content: '😀';\\n}\\n\\n.agent-state-packed:before {\\n    content: '🥵';\\n}\\n\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://js-agent/./ui/styles/scene.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./ui/styles/ui.css":
/*!****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./ui/styles/ui.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);\n// Imports\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \"body {\\n    background: #000;\\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\\n    font-size: 12px;\\n    color: #fff;\\n}\\n\\n#controls fieldset {\\n    float: right;\\n    clear: both;\\n    width: 100px;\\n}\\n\\ninput, select, button {\\n    float: left;\\n    clear: both;\\n    width: 90px;\\n    margin: 1px;\\n}\\n\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://js-agent/./ui/styles/ui.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./ui/styles/scene.css":
/*!*****************************!*\
  !*** ./ui/styles/scene.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_scene_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./scene.css */ \"./node_modules/css-loader/dist/cjs.js!./ui/styles/scene.css\");\n\n            \n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_scene_css__WEBPACK_IMPORTED_MODULE_1__.default, options);\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_scene_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});\n\n//# sourceURL=webpack://js-agent/./ui/styles/scene.css?");

/***/ }),

/***/ "./ui/styles/ui.css":
/*!**************************!*\
  !*** ./ui/styles/ui.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./ui.css */ \"./node_modules/css-loader/dist/cjs.js!./ui/styles/ui.css\");\n\n            \n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_1__.default, options);\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});\n\n//# sourceURL=webpack://js-agent/./ui/styles/ui.css?");

/***/ }),

/***/ "./engine/input-handler.ts":
/*!*********************************!*\
  !*** ./engine/input-handler.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.InputHandler = void 0;\nclass InputHandler {\n    constructor(game, ui) {\n        this.game = game;\n        ui.setInputHandler(this);\n    }\n    command(command, data) {\n        return this.game.command(command, data);\n    }\n}\nexports.InputHandler = InputHandler;\n\n\n//# sourceURL=webpack://js-agent/./engine/input-handler.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DestinationLocation = void 0;\nconst resources_definition_1 = __webpack_require__(/*! ../../../util/resources-definition */ \"./engine/objects/util/resources-definition.ts\");\nconst job_1 = __webpack_require__(/*! ../../job */ \"./engine/objects/instances/job.ts\");\nconst item_a_1 = __webpack_require__(/*! ../../resources/item-a */ \"./engine/objects/instances/resources/item-a.ts\");\nconst item_b_1 = __webpack_require__(/*! ../../resources/item-b */ \"./engine/objects/instances/resources/item-b.ts\");\nconst location_entity_1 = __webpack_require__(/*! ../location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\nclass DestinationLocation extends location_entity_1.LocationEntity {\n    constructor(...args) {\n        // @ts-ignore\n        super(...args);\n        this.procesAfterTicks = 50;\n    }\n    onProcess() {\n        var _a, _b;\n        if (this.processTicks < this.procesAfterTicks) {\n            return;\n        }\n        this.resetProcessTicks();\n        let inputResourcesDefinition = new resources_definition_1.ResourcesDefinition();\n        inputResourcesDefinition.addDefinition(new item_a_1.ItemA(), 5);\n        let outputResourcesDefinition = new resources_definition_1.ResourcesDefinition();\n        outputResourcesDefinition.addDefinition(new item_b_1.ItemB(), 2);\n        this.convertResources(inputResourcesDefinition, outputResourcesDefinition);\n        let matchingResource = (_a = this.game) === null || _a === void 0 ? void 0 : _a.resources.findOneClosestByType(new item_a_1.ItemA(), this.position);\n        if (!matchingResource) {\n            return;\n        }\n        // @ts-ignore\n        let job = new job_1.Job(matchingResource.getLocation(), this, matchingResource);\n        matchingResource.assignToJob(job);\n        (_b = this.game) === null || _b === void 0 ? void 0 : _b.addJob(job);\n    }\n}\nexports.DestinationLocation = DestinationLocation;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/locations/destination.ts?");

/***/ }),

/***/ "./engine/objects/instances/entities/locations/source.ts":
/*!***************************************************************!*\
  !*** ./engine/objects/instances/entities/locations/source.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SourceLocation = void 0;\nconst item_a_1 = __webpack_require__(/*! ../../resources/item-a */ \"./engine/objects/instances/resources/item-a.ts\");\nconst location_entity_1 = __webpack_require__(/*! ../location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\nclass SourceLocation extends location_entity_1.LocationEntity {\n    onCreate() {\n        for (let index = 0; index < 10; index++) {\n            let resource = new item_a_1.ItemA();\n            resource.pickable = true;\n            this.createResource(resource);\n        }\n    }\n    onProcess() {\n        if (this.processTicks < 10) {\n            return;\n        }\n        if (this.getResources().length >= 20) {\n            return;\n        }\n        let resource = new item_a_1.ItemA();\n        resource.pickable = true;\n        this.createResource(resource);\n        this.resetProcessTicks();\n    }\n}\nexports.SourceLocation = SourceLocation;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/entities/locations/source.ts?");

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

/***/ "./engine/objects/instances/resource.ts":
/*!**********************************************!*\
  !*** ./engine/objects/instances/resource.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Resource = void 0;\nconst instance_1 = __webpack_require__(/*! ../instance */ \"./engine/objects/instance.ts\");\nclass Resource extends instance_1.Instance {\n    constructor() {\n        super();\n        this.owner = 'location'; // location, agent\n        this.locationId = undefined;\n        this.jobId = undefined;\n        this.pickable = false;\n    }\n    getLocation() {\n        var _a;\n        return this.locationId\n            ? (_a = this.game) === null || _a === void 0 ? void 0 : _a.locations.findOneById(this.locationId) : undefined;\n    }\n    assignToLocation(location) {\n        this.locationId = location.id;\n        this.owner = 'location';\n        this.pickable = false;\n    }\n    assignToJob(job) {\n        this.jobId = job.id;\n        this.pickable = false;\n    }\n    assignToAgent() {\n        this.owner = 'agent';\n        this.pickable = false;\n    }\n}\nexports.Resource = Resource;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/instances/resource.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Position = void 0;\nclass Position {\n    constructor(x, y) {\n        this.x = parseInt(x, 10);\n        this.y = parseInt(y, 10);\n    }\n    static findClosestEntity(position, entities) {\n        let closestDistance;\n        let closestEntity = undefined;\n        entities.forEach((entity) => {\n            let distance = Math.abs(position.x - entity.position.x) + Math.abs(position.y - entity.position.y);\n            if (!closestEntity || distance < closestDistance) {\n                closestEntity = entity;\n                closestDistance = distance;\n            }\n        });\n        return closestEntity;\n    }\n}\nexports.Position = Position;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/position.ts?");

/***/ }),

/***/ "./engine/objects/util/resources-definition.ts":
/*!*****************************************************!*\
  !*** ./engine/objects/util/resources-definition.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ResourcesDefinition = void 0;\nclass ResourcesDefinition {\n    constructor() {\n        this.definitions = {};\n    }\n    addDefinition(resource, amount) {\n        this.definitions[resource.constructor.name] = {\n            resource: resource,\n            amountRequested: amount,\n            amountMatched: 0,\n        };\n    }\n    hasResource(resource) {\n        return this.definitions.hasOwnProperty(resource.constructor.name);\n    }\n    matchResource(resource) {\n        if (!this.hasResource(resource)) {\n            return false;\n        }\n        if (this.definitions[resource.constructor.name].amountMatched >= this.definitions[resource.constructor.name].amountRequested) {\n            return false;\n        }\n        this.definitions[resource.constructor.name].amountMatched++;\n        return true;\n    }\n    hasMissingResources() {\n        let hasMissingResources = false;\n        Object.keys(this.definitions).forEach((resourceClass) => {\n            if (this.definitions[resourceClass].amountMatched < this.definitions[resourceClass].amountRequested) {\n                hasMissingResources = true;\n            }\n        });\n        return hasMissingResources;\n    }\n    resetMatches() {\n        Object.keys(this.definitions).forEach((resourceClass) => {\n            this.definitions[resourceClass].amountMatched = 0;\n        });\n    }\n}\nexports.ResourcesDefinition = ResourcesDefinition;\n\n\n//# sourceURL=webpack://js-agent/./engine/objects/util/resources-definition.ts?");

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

/***/ }),

/***/ "./ui/scripts/ui.ts":
/*!**************************!*\
  !*** ./ui/scripts/ui.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ui = void 0;\nconst game_1 = __webpack_require__(/*! ../../engine/game */ \"./engine/game.js\");\nconst input_handler_1 = __webpack_require__(/*! ../../engine/input-handler */ \"./engine/input-handler.ts\");\nconst output_handler_1 = __webpack_require__(/*! ../../engine/output-handler */ \"./engine/output-handler.ts\");\nconst ui_controls_1 = __webpack_require__(/*! ./ui-controls */ \"./ui/scripts/ui-controls.js\");\nconst ui_details_1 = __webpack_require__(/*! ./ui-details */ \"./ui/scripts/ui-details.js\");\nconst ui_scene_1 = __webpack_require__(/*! ./ui-scene */ \"./ui/scripts/ui-scene.js\");\nconst ui_meta_1 = __webpack_require__(/*! ./ui-meta */ \"./ui/scripts/ui-meta.js\");\nconst stylesUi = __webpack_require__(/*! ../styles/ui.css */ \"./ui/styles/ui.css\");\nconst stylesScene = __webpack_require__(/*! ../styles/scene.css */ \"./ui/styles/scene.css\");\n/*\nclass Boot extends Phaser.Scene {\n\n    preload() {\n        this.load.pack(\"pack\", \"assets/asset-pack.json\");\n    }\n\n    create() {\n        this.scene.start(\"Level\");\n    }\n\n}\n*/\nclass Ui {\n    /**\n     * Creates an instance of Ui. The entry point of the whole game ui\n     * @param {Document} domDocument\n     * @param {String} controlsSelector\n     * @param {*} sceneSelector\n     * @param {*} detailsSelector\n     * @memberof Ui\n     */\n    constructor(domDocument, controlsSelector, sceneSelector, detailsSelector, metaSelector) {\n        this.inputHandler = undefined;\n        this.controlsSelector = controlsSelector;\n        this.sceneSelector = domDocument.querySelector(sceneSelector);\n        this.detailsSelector = detailsSelector;\n        this.metaSelector = metaSelector;\n        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);\n        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);\n        this.metaDomElement = domDocument.querySelector(this.metaSelector);\n        this.details = new ui_details_1.UiDetails(this.detailsDomElement);\n        // sceneSelector might be undefined, this we will enforce it for now\n        // TODO: Needs to be reworked - prone to fail at any time.\n        this.scene = new ui_scene_1.UiScene(this, this.sceneSelector, domDocument, this.details);\n        this.controls = new ui_controls_1.UiControls(this, this.controlsDomElement, this.scene);\n        this.meta = new ui_meta_1.UiMeta(this, this.metaDomElement);\n        /*\n        const game = new Phaser.Game({\n            width: 800,\n            height: 600,\n            type: Phaser.AUTO,\n            backgroundColor: \"#242424\",\n            scale: {\n                mode: Phaser.Scale.FIT,\n                autoCenter: Phaser.Scale.CENTER_BOTH\n            }\n        });\n        game.scene.add(\"Level\", GameLevel);\n        game.scene.add(\"Boot\", Boot, true);\n        */\n    }\n    /**\n     *\n     * @param {InputHandler} inputHandler\n     */\n    setInputHandler(inputHandler) {\n        this.inputHandler = inputHandler;\n    }\n    /**\n     *\n     * @param {String} command\n     * @param {Object} data\n     * @returns {any}\n     */\n    handleInput(command, data) {\n        var _a;\n        return (_a = this.inputHandler) === null || _a === void 0 ? void 0 : _a.command(command, data);\n    }\n    /**\n     *\n     * @param {LocationEntity[]} locations\n     * @param {AgentEntity[]} agents\n     * @param {Job[]} jobs\n     * @param {Resource[]} resources\n     */\n    updateState(locations, agents, jobs, resources) {\n        /*\n        console.clear();\n        console.table(locations);\n        console.table(agents);\n        console.table(jobs);\n        console.table(resources);\n        */\n        this.scene.render(locations, agents);\n        this.meta.render();\n    }\n}\nexports.Ui = Ui;\nvar game = new game_1.Game({}, (callback) => {\n    window.requestAnimationFrame(callback);\n});\nvar ui = new Ui(document, '#controls', '#scene', '#details', '#meta');\nnew input_handler_1.InputHandler(game, ui);\nnew output_handler_1.OutputHandler(game, ui);\n\n\n//# sourceURL=webpack://js-agent/./ui/scripts/ui.ts?");

/***/ }),

/***/ "./ui/scripts/ui-controls.js":
/*!***********************************!*\
  !*** ./ui/scripts/ui-controls.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UiControls\": () => (/* binding */ UiControls)\n/* harmony export */ });\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ \"./ui/scripts/ui.ts\");\n/* harmony import */ var _ui_scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-scene */ \"./ui/scripts/ui-scene.js\");\n\n\n\nclass UiControls {\n    /**\n     *\n     * @param {Ui} ui\n     * @param {Element} domElement\n     * @param {UiScene} scene\n     */\n    constructor(ui, domElement, scene) {\n        this.ui = ui;\n        this.domElement = domElement;\n        this.scene = scene;\n\n        this.btnStart = this.domElement.querySelector('#start');\n        this.btnPause = this.domElement.querySelector('#pause');\n        this.btnAddSource = this.domElement.querySelector('#addSource');\n        this.btnAddDestination = this.domElement.querySelector('#addDestination');\n        this.btnAddBusyDestination = this.domElement.querySelector('#addBusyDestination');\n        this.btnAddAgent = this.domElement.querySelector('#addAgent');\n        /** @type {HTMLSelectElement} */\n        this.inputUpdateSettingKey = this.domElement.querySelector('#updateSettingKey');\n        /** @type {HTMLInputElement} */\n        this.inputUpdateSettingValue = this.domElement.querySelector('#updateSettingValue');\n        this.btnUpdateSetting = this.domElement.querySelector('#updateSetting');\n        this.btnExport = this.domElement.querySelector('#export');\n        this.btnImport = this.domElement.querySelector('#import');\n\n        this.addEventListeners();\n    }\n\n    addEventListeners() {\n        this.btnStart.addEventListener('click', (event) => {\n            this.ui.handleInput('control:start');\n        });\n\n        this.btnPause.addEventListener('click', (event) => {\n            this.ui.handleInput('control:pause');\n        });\n\n        this.btnAddSource.addEventListener('click', (event) => {\n            this.scene.setClickMode('addSource');\n        });\n\n        this.btnAddDestination.addEventListener('click', (event) => {\n            this.scene.setClickMode('addDestination');\n        });\n\n        this.btnAddBusyDestination.addEventListener('click', (event) => {\n            this.scene.setClickMode('addBusyDestination');\n        });\n\n        this.btnAddAgent.addEventListener('click', (event) => {\n            this.scene.setClickMode('addAgent');\n        });\n\n        this.btnUpdateSetting.addEventListener('click', (event) => {\n            let oldValue = this.ui.handleInput('setting:update', {key: this.inputUpdateSettingKey.value, value: this.inputUpdateSettingValue.value}).oldValue;\n\n            console.log('Update setting ' + this.inputUpdateSettingKey.value + ' from \"' + oldValue + '\" to \"' + this.inputUpdateSettingValue.value + '\"');\n        });\n\n        this.btnExport.addEventListener('click', (event) => {\n            console.log('Export:', this.ui.handleInput('gamestate:export'));\n        });\n\n        this.btnImport.addEventListener('click', (event) => {\n            const state = {\n                settings: {},\n                locations: [],\n                agents: [],\n                jobs: [],\n            };\n\n            this.ui.handleInput('gamestate:import', {state: JSON.stringify(state)});\n        });\n    }\n}\n\n\n//# sourceURL=webpack://js-agent/./ui/scripts/ui-controls.js?");

/***/ }),

/***/ "./ui/scripts/ui-details.js":
/*!**********************************!*\
  !*** ./ui/scripts/ui-details.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UiDetails\": () => (/* binding */ UiDetails)\n/* harmony export */ });\nclass UiDetails {\n    /**\n     *\n     * @param {Element} domElement\n     */\n    constructor(domElement) {\n        this.domElement = domElement;\n    }\n\n    /**\n     *\n     * @param {String} content\n     */\n    render(content) {\n        this.domElement.innerHTML = content;\n    }\n}\n\n\n//# sourceURL=webpack://js-agent/./ui/scripts/ui-details.js?");

/***/ }),

/***/ "./ui/scripts/ui-meta.js":
/*!*******************************!*\
  !*** ./ui/scripts/ui-meta.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UiMeta\": () => (/* binding */ UiMeta)\n/* harmony export */ });\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ \"./ui/scripts/ui.ts\");\n\n\nclass UiMeta {\n    /**\n     *\n     * @param {Ui} ui\n     * @param {Element} domElement\n     */\n    constructor(ui, domElement) {\n        this.ui = ui;\n        this.domElement = domElement;\n        this.counter = 0;\n\n        setInterval(() => {\n            this.domElement.innerHTML = `${this.counter} FPS`;\n            this.counter = 0;\n        }, 1000);\n    }\n\n    render() {\n        this.counter++;\n    }\n}\n\n\n//# sourceURL=webpack://js-agent/./ui/scripts/ui-meta.js?");

/***/ }),

/***/ "./ui/scripts/ui-scene.js":
/*!********************************!*\
  !*** ./ui/scripts/ui-scene.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UiScene\": () => (/* binding */ UiScene)\n/* harmony export */ });\n/* harmony import */ var _engine_objects_instances_entities_agent_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../engine/objects/instances/entities/agent-entity */ \"./engine/objects/instances/entities/agent-entity.ts\");\n/* harmony import */ var _engine_objects_instances_entities_location_entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../engine/objects/instances/entities/location-entity */ \"./engine/objects/instances/entities/location-entity.ts\");\n/* harmony import */ var _engine_objects_instances_entities_locations_destination__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../engine/objects/instances/entities/locations/destination */ \"./engine/objects/instances/entities/locations/destination.ts\");\n/* harmony import */ var _engine_objects_instances_entities_locations_destination_busy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../engine/objects/instances/entities/locations/destination-busy */ \"./engine/objects/instances/entities/locations/destination-busy.ts\");\n/* harmony import */ var _engine_objects_instances_entities_locations_source__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../engine/objects/instances/entities/locations/source */ \"./engine/objects/instances/entities/locations/source.ts\");\n/* harmony import */ var _engine_objects_position__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../engine/objects/position */ \"./engine/objects/position.ts\");\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui */ \"./ui/scripts/ui.ts\");\n/* harmony import */ var _ui_details__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ui-details */ \"./ui/scripts/ui-details.js\");\n\n\n\n\n\n\n\n\n\nclass UiScene {\n    /**\n     *\n     * @param {Ui} ui\n     * @param {Element} domElement\n     * @param {Document} domDocument\n     * @param {UiDetails} uiDetails\n     */\n    constructor(ui, domElement, domDocument, uiDetails) {\n        this.ui = ui;\n        this.domElement = domElement;\n        this.domDocument = domDocument;\n        this.uiDetails = uiDetails;\n\n        this.clickMode = null;\n        this.focusedObjectId = null;\n        this.locationCache = null;\n        this.domElementIdPrefix = 'id-';\n\n        this.domElement.addEventListener('click', (/** @type {MouseEvent} */ event) => {\n            this.processClickEvent(event);\n        });\n    }\n\n    /**\n     *\n     * @param {String} clickMode\n     */\n    setClickMode(clickMode) {\n        this.clickMode = clickMode;\n    }\n\n    /**\n     *\n     * @param {MouseEvent} event\n     */\n    processClickEvent(event) {\n        this.focusedObjectId = null;\n\n        if (event.target !== this.domElement) {\n            this.processClickEventOnObject(event);\n        }\n        else {\n            this.processClickEventOnScene(event);\n        }\n    }\n\n    /**\n     *\n     * @param {MouseEvent} event\n     */\n    processClickEventOnScene(event) {\n        if (!this.clickMode) {\n            return;\n        }\n\n        let position = this.getPositionForEvent(event);\n\n        console.log('click on:', position);\n        console.log('click mode:', this.clickMode);\n\n        let instanceId;\n\n        switch (this.clickMode) {\n            case 'addSource':\n                instanceId = this.ui.handleInput('location:add', new _engine_objects_instances_entities_locations_source__WEBPACK_IMPORTED_MODULE_4__.SourceLocation(position));\n                break;\n\n            case 'addDestination':\n                instanceId = this.ui.handleInput('location:add', new _engine_objects_instances_entities_locations_destination__WEBPACK_IMPORTED_MODULE_2__.DestinationLocation(position));\n                break;\n\n            case 'addBusyDestination':\n                instanceId = this.ui.handleInput('location:add', new _engine_objects_instances_entities_locations_destination_busy__WEBPACK_IMPORTED_MODULE_3__.DestinationBusyLocation(position));\n                break;\n\n            case 'addAgent':\n                instanceId = this.ui.handleInput('agent:add', new _engine_objects_instances_entities_agent_entity__WEBPACK_IMPORTED_MODULE_0__.AgentEntity(position));\n                break;\n\n            default:\n                console.log('Unknown clickMode: ', this.clickMode);\n                break;\n        }\n\n        if (instanceId) {\n            console.log('Added instance:', instanceId);\n        }\n\n        // this.clickMode = null;\n    }\n\n    /**\n     *\n     * @param {MouseEvent} event\n     */\n    processClickEventOnObject(event) {\n        this.focusedObjectId = event.target.id;\n        this.updateDetails();\n    }\n\n    /**\n     *\n     * @param {MouseEvent} event\n     * @returns {Position}\n     */\n    getPositionForEvent(event) {\n        const sceneRect = this.domElement.getBoundingClientRect();\n\n        return new _engine_objects_position__WEBPACK_IMPORTED_MODULE_5__.Position(event.clientX - sceneRect.left, event.clientY - sceneRect.top);\n    }\n\n    /**\n     *\n     * @param {LocationEntity[]} locations\n     * @param {AgentEntity[]} agents\n     */\n    render(locations, agents) {\n        this.locationCache = locations;\n\n        this.domRemoveObsoleteLocations(locations);\n        this.domRemoveObsoleteAgents(agents);\n\n        this.domUpdateLocations(locations);\n        this.domUpdateAgents(agents);\n\n        this.updateDetails();\n    }\n\n    /**\n     *\n     * @param {LocationEntity[]} locations\n     */\n    domRemoveObsoleteLocations(locations) {\n        let domLocations = this.domElement.querySelectorAll('.building');\n        let locationIds = locations.map((location) => {\n            return `${this.domElementIdPrefix}${location.id}`;\n        });\n\n        domLocations.forEach((domLocation) => {\n            if (!locationIds.includes(domLocation.id)) {\n                domLocation.remove();\n            }\n        });\n    }\n\n    /**\n     *\n     * @param {AgentEntity[]} agents\n     */\n    domRemoveObsoleteAgents(agents) {\n        let domAgents = this.domElement.querySelectorAll('.agent');\n        let agentIds = agents.map((agent) => {\n            return agent.id;\n        });\n\n        domAgents.forEach((domAgent) => {\n            if (!agentIds.includes(domAgent.id)) {\n                domAgent.remove();\n            }\n        });\n    }\n\n    /**\n     *\n     * @param {LocationEntity[]} locations\n     */\n    domUpdateLocations(locations) {\n        locations.forEach((building) => {\n            let domBuilding = this.domEnsureElementForTyoe('building', building.id);\n\n            this.domUpdateElementPosition(domBuilding, building.position);\n\n            domBuilding.classList.add('building-' + building.constructor.name);\n        });\n    }\n\n    /**\n     *\n     * @param {AgentEntity[]} agents\n     */\n    domUpdateAgents(agents) {\n        agents.forEach((agent) => {\n            let domAgent = this.domEnsureElementForTyoe('agent', agent.id);\n\n            this.domUpdateElementPosition(domAgent, agent.position);\n\n            let job = agent.getJob();\n\n            domAgent.classList.add('agent-state-' + (job ? (job.started ? 'packed' : 'busy') : 'idle'));\n        });\n    }\n\n    /**\n     *\n     * @param {String} type\n     * @param {String} id\n     * @returns {HTMLDivElement}\n     */\n    domEnsureElementForTyoe(type, id) {\n        /** @type {HTMLDivElement} */\n        let element = this.domElement.querySelector(`#${this.domElementIdPrefix}${id}`);\n\n        if (!element) {\n            element = this.domDocument.createElement('div');\n            element.id = `${this.domElementIdPrefix}${id}`;\n\n            this.domElement.appendChild(element);\n        }\n\n        element.classList.remove(...element.classList);\n        element.classList.add(type);\n\n        return element;\n    }\n\n    /**\n     *\n     * @param {HTMLDivElement} element\n     * @param {Position} position\n     */\n    domUpdateElementPosition(element, position) {\n        element.style.left = position.x + 'px';\n        element.style.top = position.y + 'px';\n    }\n\n    updateDetails() {\n        this.showDetails(this.focusedObjectId);\n    }\n\n    /**\n     *\n     * @param {String|null} id\n     */\n    showDetails(id) {\n        if (!id) {\n            this.uiDetails.render('');\n\n            return;\n        }\n\n        const matchingLocation = this.locationCache.find((location) => {\n            return `${this.domElementIdPrefix}${location.id}` === id;\n        });\n\n        if (!matchingLocation) {\n            return;\n        }\n\n        const resources = matchingLocation.getResources();\n        let resourcesByType = {};\n\n        resources.forEach((resource) => {\n            if (!resourcesByType[resource.constructor.name]) {\n                resourcesByType[resource.constructor.name] = 0;\n            }\n\n            resourcesByType[resource.constructor.name]++;\n        });\n\n        this.uiDetails.render(`\n            <dl>\n                <dt>ID</dt>\n                <dd>${matchingLocation.id}</dd>\n                <dt>Type</dt>\n                <dd>${matchingLocation.constructor.name}</dd>\n                <dt>Resources (${resources.length})</dt>\n                <dd>${JSON.stringify(resourcesByType)}</dd>\n                <dt>Actions</dt>\n                <dd><a href=\"#\">Remove</a></dd>\n            </dl>\n        `);\n    }\n}\n\n\n//# sourceURL=webpack://js-agent/./ui/scripts/ui-scene.js?");

/***/ })

},
0,[["./ui/scripts/ui.ts","vendor"]]]);