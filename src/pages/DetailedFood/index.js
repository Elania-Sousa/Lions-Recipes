import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchFoodbyId, fetchRecommendedDrinks } from '../../services/DetailedItem';
import RecommendedCard from '../../components/RecommendedCard';
import DetailedFoodHeader from '../../components/DetailedFoodHeader';

export default function DetailedFood() {
  //  Globals
  const history = useHistory();
  const { idFood } = useParams();

  //  Fetch and Load.
  const [foodData, setFoodData] = useState('');
  const [recommendedFoods, setRecommendedFoods] = useState('');

  useEffect(() => {
    fetchFoodbyId(idFood).then((result) => setFoodData(result));
    fetchRecommendedDrinks().then((result) => setRecommendedFoods(result)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFood]);

  //  Get Ingredients
  const [foodEntries, setFoodEntries] = useState([]);
  const [foodIngredients, setFoodIngredients] = useState([]);

  useEffect(() => {
    setFoodEntries(Object.entries(foodData));
  }, [foodData]);

  function getIngredients() {
    foodEntries.forEach((entrie) => {
      const notNull = entrie[1] !== null && entrie[1] !== '';
      if (entrie[0].includes('strIngredient') && notNull) {
        setFoodIngredients((prevState) => [...prevState, entrie[1]]);
      }
    });
  }

  // Get Measures
  const [foodMeasure, setFoodMeasure] = useState([]);

  function getMeasures() {
    foodEntries.forEach((entrie) => {
      const notNull = entrie[1] !== null && entrie[1] !== '';
      if (entrie[0].includes('strMeasure') && notNull) {
        setFoodMeasure((prevState) => [...prevState, entrie[1]]);
      }
    });
  }

  useEffect(() => {
    getIngredients();
    getMeasures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodEntries]);

  return (
    <>
      <DetailedFoodHeader data={ foodData } />

      <section>
        <ul>
          {foodIngredients !== [] && foodIngredients.map((ingredient, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {`${ingredient} — ${foodMeasure[index]}`}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p data-testid="instructions">{foodData.strInstructions}</p>
      </section>

      <section>
        <video
          data-testid="video"
          width="200"
          height="150"
          controls
          src={ foodData.strYoutube }
        >
          <track
            default
            kind="captions"
            srcLang="en"
            src={ foodData.strYoutube }
          />
          Sorry, your browser do not support embedded videos.
        </video>
      </section>

      <section>
        { recommendedFoods !== '' && recommendedFoods.map((drink, index) => (
          <RecommendedCard
            index={ index }
            key={ drink.strDrink }
            title={ drink.strDrink }
            subtitle={ drink.strAlcoholic }
            image={ drink.strDrinkThumb }
          />
        ))}
      </section>

      <section>
        <button
          style={ {
            bottom: '0px',
            position: 'fixed',
          } }
          aria-label="Start Recipe"
          data-testid="start-recipe-btn"
          type="button"
          onClick={ () => history.push(`/foods/${idFood}/in-progress`) }
        >
          Start Recipe
        </button>
      </section>
    </>
  );
}
