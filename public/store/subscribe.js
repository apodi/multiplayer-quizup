import { populateWaitingPage, populateGamePage, populateScoreInGamePage } from '../quiz-wait/quiz-wait.controller';
import { populatesocreboardPage } from '../quiz-play/quiz-play.controller'
import C from './constants';
import store from './redux-store';

const render = () => {
    //const state = JSON.stringify(store.getState())
    //localStorage['redux-store'] = state;
    const currState = store.getState();
    const actionType = currState.action;
    switch (actionType) {
        case C.START_WAIT:
            populateWaitingPage(currState.players.users);
            break;
        case C.START_GAME:
            populateGamePage(currState.socketCustom);
            break;
        case C.GAME_OVER:
             populatesocreboardPage(currState.socketCustom);
             break;
        case C.GET_LIVE_SCORE:
            populateScoreInGamePage(currState.playerScore);
            break;
        default:
            break;
    }
};

const subscribeStore = () => {
    store.subscribe(render);
};

export default subscribeStore;