const INITIAL_STATE = {
  searchRecipes: [],
};

const recipesReducer = (state = INITIAL_STATE, action) => {
  const objectRecipesReducer = {
    GET_RECIPES: { ...state, searchRecipes: action.payload },
  };
  return objectRecipesReducer[action.type] || state;
};

export default recipesReducer;
