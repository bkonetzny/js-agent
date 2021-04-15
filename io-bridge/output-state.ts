interface OutputStateInterface {
    readonly running: boolean;
    readonly settings: Object;
    readonly locations: Array<any>;
    readonly agents: Array<any>;
    readonly jobs: Array<any>;
    readonly resources: Array<any>;
    readonly orders: Array<any>;
    readonly paths: Array<any>;
}

export {
    OutputStateInterface,
}
