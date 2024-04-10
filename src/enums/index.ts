export enum MoveCallStatus {
    BEGIN,
    FINISH,
    ERROR,
};

export enum MoveCallActionType {
    SET_MNEMONICS = "SET_MNEMONICS",
    SET_PACKAGE_ID = "SET_PACKAGE_ID",
    SET_MODULES = "SET_MODULES",
    SET_ERROR = "SET_ERROR",
    SET_CURRENT_MODULE = "SET_CURRENT_MODULE",
    SET_FUNCTIONS = "SET_FUNCTIONS",
    SET_CURRENT_FUNCTION = "SET_CURRENT_FUNCTION",
    RESET_ARGS = "RESET_ARGS",
    RESET_ARGS_USER_INPUT = "RESET_ARGS_USER_INPUT",
    ADD_ARG = "ADD_ARG",
    SET_VALUE_TO_ARG = "SET_VALUE_TO_ARG",
    SET_RESPONSE = "SET_RESPONSE",
};

export enum SuiCommand {
    GET_ADDRESSES = "GET_ADDRESSES",
    GET_GAS_OBJECTS = "GET_GAS_OBJECTS",
    SWITCH_ADDRESS = "SWITCH_ADDRESS",
    SWITCH_NETWORK = "SWITCH_NETWORK",
    GET_NETWORKS = "GET_NETWORKS",
    PUBLISH_PACKAGE = "PUBLISH_PACKAGE",
    CALL_FUNCTION = "CALL_FUNCTION",
    REQUEST_FAUCET = "REQUEST_FAUCET",
    BUILD_PACKAGE = "BUILD_PACKAGE",
    TEST_PACKAGE = "TEST_PACKAGE",
}