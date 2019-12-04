import { createStore, combineReducers, applyMiddleware, compose } from 'redux';//리덕스에서 사용할 것들. 
/*
    createStore = 말 그대로 스토어를 만드는 것.
    combineReducers = 많은 리듀서를 하나로 묶어서 사용하는것.
    applyMiddleware = 
    compose =  깊이 중첩된 함수 변환을 길게 늘어진 코드 없이 작성하게 해주는 것
*/
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

//기본 스테이트값
const initialState = {};

//미들웨어 thunk
const middleware = [thunk];

//리듀서 묶어서 편하게 사용하기.
const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer
});

//create 스토어, window.___REDUX... 는 크롬에 리덕스 앱을 사용하기 위함.
const store = createStore(reducers, initialState, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default store;