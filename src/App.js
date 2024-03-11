import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Recipe from './Recipe';

const App = () => 
{
  const APP_ID = "37e5392f";
  const APP_KEY = "df5c69aac164447786220dfaf2bfa88f	";
  const allHealthLabels = ["alcohol-cocktail", "alcohol-free", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", 
    "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "Mediterranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", 
    "pescatarian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"];

  //const [counter, setCounter] = useState(0);
  const [recipes, setRecipes] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [query, setQuery] = useState("banana"); //adding this state so that we can only update it when the submit button is pressed, thus the recipes are only fetched when the user has submitted the query.
  const [healthLabels, setHealthLabels] = useState([]);
  //useEffect(() => {console.log("useEffect called")}, [counter]); //only run when counter value changes

  useEffect( () => {
    getRecipes();
  }, [query, healthLabels]); //the only time we fetch recipes is when the query or health label filters gets updated

  const getRecipes = async () => {
    var response;
    console.log(healthLabels);
    if(healthLabels.length > 0) {
      const healthLabelString = healthLabels.join('&health=');
      response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&health=${healthLabelString}`); //add await because it can take some time
    }

    else {
      response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`); //add await because it can take some time
    }
    
    const data = await response.json();
    setRecipes(data.hits);
    console.log(recipes)
  }

  const readSearch = e => { 
     setSearch(e.target.value); //target is the search form input in the onChange call  
  } 

  const getSearch = e => {
    e.preventDefault(); //prevent the page refreshing
    setQuery(search); 
    
    if (document.getElementsByClassName('health-label-item') != undefined) {
      const checkedHealthLabels = Array.from(document.getElementsByClassName('health-label-item'))?.filter(label => label.firstElementChild.checked)?.map(label => label.textContent);
      setHealthLabels(checkedHealthLabels);
    }
    
    else {
      setHealthLabels(['']);
    }
  }

  const toggle = e => {
    let element = document.getElementById("health-label-menu");
    let hidden = element.getAttribute("hidden");

    if (hidden != null) {
       element.removeAttribute("hidden");
    } else {
       element.setAttribute("hidden", "hidden");
    }
  }


  return ( 
    <div className='App'> 
      <div className='search-menu'>
        <div className='search-menu-item'>
          <form className="search-form">
            <input className="search-input" type='text' value={search} onChange={readSearch}></input>
            <button className="search-button" type='submit' onClick={getSearch}>Search Recipes</button>
          </form>
        </div>
        <div className="search-menu-item">
          <button onClick={toggle} className="dropbtn">Filter By Dietary Needs</button>
          <form id='health-label-menu' className='health-menu-checkboxes' hidden='hidden'>
            {allHealthLabels.map(label => (
                      [<label for={label} className='health-label-item'><input type='checkbox' value={label} id={label}></input>{label}</label>, <br></br>]
                  ))}
            <button className="search-button" type='submit' onClick={getSearch}>Apply Filters</button>
          </form>
        </div>
      </div>
      <div className="recipes">
      {recipes.map(recipe => (    //recipes are an array, so we can map them. In this case we're mapping the recipe data to the proper HTML elements
        <Recipe 
          key={recipe.recipe.label} //if we don't provide a key then rendering will take more time. Note that this key should be unique.
          title={recipe.recipe.label} 
          image={recipe.recipe.image}
          ingredients={recipe.recipe.ingredients}
          url={recipe.recipe.url}
          />))}; 
      </div>
    </div>
  );
}; 


export default App;
