

//WorldActionTypes
const CREATE_WORLD = "world/CREATE_WORLD";

//PlayerActionTypes
const ADD_PLAYER = "player/ADD_PLAYER";
const MOVE_PLAYER = "player/MOVE_PLAYER";
const GO_UPSTAIRS = "player/GO_UPSTAIRS";

//LightActionTypes
const SWITCH_LIGHTS = "lights/SWITCH_LIGHTS";

//EntityActionTypes
const ADD_ENTITIES = "entities/ADD_ENTITIES";


const WorldActionTypes = {CREATE_WORLD};
const PlayerActionTypes = {ADD_PLAYER, MOVE_PLAYER, GO_UPSTAIRS};
const LightActionTypes = {SWITCH_LIGHTS};
const EntityActionTypes = {ADD_ENTITIES};

export {WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes};