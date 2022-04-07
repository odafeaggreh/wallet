import * as marketActions from "./marketActions";

const initialState = {
  myHoldings: [],
  coins: [],
  error: null,
  loading: true,
};

const marketReducer = (state = initialState, action) => {
  switch (action.type) {
    case marketActions.GET_HOLDINGS_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case marketActions.GET_HOLDINGS_SUCCESS:
      return {
        ...state,
        myHoldings: action.payload.myHoldings,
        loading: false,
      };
    case marketActions.GET_HOLDINGS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    case marketActions.GET_COIN_MARKET_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case marketActions.GET_COIN_MARKET_SUCCESS:
      return {
        ...state,
        coins: action.payload.coins,
        loading: false,
      };

    case marketActions.GET_COIN_MARKET_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    default:
      return state;
  }
};

export default marketReducer;
