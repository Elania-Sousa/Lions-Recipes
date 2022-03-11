import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

function IngredientsList({ ingredients, measure, idRecipes, type, data }) {
  console.log(data);
  const history = useHistory();

  const [checkedInput, setCheckedInput] = useState(() => {
    const prevLocalStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (!prevLocalStorage[type][idRecipes]) return [];
    const { [type]: { [idRecipes]: ingredientsList } } = prevLocalStorage;
    return ingredientsList;
  });

  function addRecipeInLocalStorage(ingredient, prevLocalStorage) {
    setCheckedInput([ingredient]);
    localStorage.setItem('inProgressRecipes', JSON.stringify(
      { ...prevLocalStorage, [type]: { [idRecipes]: [ingredient] } },
    ));
  }

  function addIngredientsOfRecipe(ingredient, ingredientsList, prevLocalStorage) {
    setCheckedInput((prev) => [...prev, ingredient]);
    localStorage.setItem('inProgressRecipes', JSON.stringify(
      { ...prevLocalStorage,
        [type]:
        { [idRecipes]: [...ingredientsList, ingredient] } },
    ));
  }

  function removeIngredientsOfRecipe(ingredient, ingredientsList, prevLocalStorage) {
    setCheckedInput((prev) => [...prev.filter((ingre) => ingre !== ingredient)]);
    localStorage.setItem('inProgressRecipes', JSON.stringify(
      { ...prevLocalStorage,
        [type]:
            { [idRecipes]:
              [...ingredientsList.filter((ingre) => ingre !== ingredient)] } },
    ));
  }

  function handleChange(ingredient) {
    const prevLocalStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (!prevLocalStorage[type][idRecipes]) {
      addRecipeInLocalStorage(ingredient, prevLocalStorage);
    } else {
      const { [type]: { [idRecipes]: ingredientsList } } = prevLocalStorage;
      if (!ingredientsList.includes(ingredient)) {
        addIngredientsOfRecipe(ingredient, ingredientsList, prevLocalStorage);
      } else {
        removeIngredientsOfRecipe(ingredient, ingredientsList, prevLocalStorage);
      }
    }
  }

  function handleClick() {
    const doneRecipe = {
      id: data.idMeal || data.idDrink,
      type: data.idMeal ? 'food' : 'drink',
      nationality: data.strArea || '',
      category: data.strCategory,
      alcoholicOrNot: data.strAlcoholic ? data.strAlcoholic : '',
      name: data.strMeal || data.strDrink,
      image: data.strMealThumb || data.strDrinkThumb,
      doneDate: new Date().toISOString(),
      tags: data.strTags ? data.strTags.split(',') : [],
    };

    const prevStore = localStorage.getItem('doneRecipes');
    if (prevStore) {
      localStorage.setItem('doneRecipes', JSON.stringify(
        [...prevStore, doneRecipe],
      ));
    } else {
      localStorage.setItem('doneRecipes', JSON.stringify([doneRecipe]));
    }
    history.push('/done-recipes');
  }

  return (
    <section>
      <section>
        <ul>
          {ingredients !== [] && ingredients.map((ingredient, index) => (
            <li
              key={ index }
            >
              <label
                style={ checkedInput.includes(ingredient)
                  ? { textDecoration: 'line-through' }
                  : { textDecoration: 'none' } }
                data-testid={ `${index}-ingredient-step` }
                htmlFor={ ingredient }
              >
                <input
                  id={ ingredient }
                  type="checkbox"
                  checked={ checkedInput.includes(ingredient) }
                  onChange={ () => handleChange(ingredient) }
                />
                {`${ingredient} — ${measure[index]}`}
              </label>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <p data-testid="instructions">{data.strInstructions}</p>
      </section>
      <section>
        <button
          className="finish-button"
          aria-label="Finish Recipe"
          data-testid="finish-recipe-btn"
          disabled={ checkedInput.length !== ingredients.length }
          type="button"
          onClick={ handleClick }
        >
          Finish Recipe
        </button>
      </section>
    </section>
  );
}

IngredientsList.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.any).isRequired,
  measure: PropTypes.arrayOf(PropTypes.any).isRequired,
  idRecipes: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default IngredientsList;
