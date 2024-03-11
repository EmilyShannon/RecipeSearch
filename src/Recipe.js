import React from "react";

const Recipe = ({title, image, ingredients}) => {
    return(
        <div className="recipe-item">
            <h1>{title}</h1>
            <img src={image} alt="" className="recipe-img"/>
            <ul className="ingredients-list">
                {ingredients.map(ingredient => (
                    <li className="ingredient-item">{ingredient.text}</li>
                ))}
            </ul>
        </div>
    );
}

export default Recipe;