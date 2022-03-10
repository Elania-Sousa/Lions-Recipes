import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

export default function DetailedFoodHeader({ data }) {
  // Clipboard.
  const { pathname } = useLocation();
  const [copied, setCopied] = useState(false);

  function copyLink() {
    copy(`http://localhost:3000${pathname}`);
    setCopied(true);
  }

  /*          FAVORITE BUTTON                */
  const [isFavorited, setIsFavorite] = useState(false);

  // Favoring Item.
  function favButton() {
    setIsFavorite((prevState) => !prevState);
    const prevState = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const actualState = {
      id: data.idMeal,
      type: 'food',
      nationality: data.strArea,
      category: data.strCategory,
      alcoholicOrNot: '',
      name: data.strMeal,
      image: data.strMealThumb,
    };
    if (prevState === null) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([actualState]));
    } else {
      localStorage.setItem('favoriteRecipes',
        JSON.stringify([...prevState, actualState]));
    }
  }

  // Unfavoring Item.
  function unfavButton() {
    setIsFavorite((prevState) => !prevState);
    const prevState = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newState = prevState.filter((element) => element.id !== data.idMeal);
    localStorage.setItem('favoriteRecipes',
      JSON.stringify([...newState]));
  }

  // Check Favorite Button Status.
  function checkFavorite() {
    const prevState = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (prevState !== null) {
      prevState.forEach((favorited) => {
        if (favorited.id === data.idMeal) setIsFavorite(true);
      });
    }
  }

  // Ruy.
  const favoriteFunctions = {
    true: unfavButton,
    false: favButton,
  };

  useEffect(() => {
    checkFavorite(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <header>
      <img data-testid="recipe-photo" src={ data.strMealThumb } alt="foodImage" />
      <h1 data-testid="recipe-title">{data.strMeal}</h1>
      <h2 data-testid="recipe-category">{data.strCategory}</h2>
      <button type="button" data-testid="share-btn" onClick={ () => copyLink() }>
        <img src={ shareIcon } alt="shareIcon" />
      </button>
      <button onClick={ () => favoriteFunctions[isFavorited]() } type="button">
        <img
          data-testid="favorite-btn"
          src={ isFavorited ? blackHeartIcon : whiteHeartIcon }
          alt="favIcon"
        />
      </button>

      {copied && <p>Link copied!</p>}

    </header>
  );
}

DetailedFoodHeader.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};