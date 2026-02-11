export type full_item_data = {
  id: number;
  name: string | null;
  //add price data
  output_of_recipes: recipe[];
  input_of_recipes: recipe[];
};

export type discipline = {
  id: number;
  name: string;
};

export type recipe = {
  id: number;
  output_item: simple_item_data;
  output_item_count: number;
  min_rating: number | null;
  disciplines: discipline[];
  ingredients: ingredient[];
};

export type recipe_tree = {
  recipe: recipe_response;
  ingredient_trees: ingredient_tree[];
};

export type ingredient_tree = {
  ingredient: ingredient;
  recipe_trees: recipe_tree[];
};

export type item_data = {
  id: number;
  name: string;
  price: price_data;
};

export type price_data = {
  buys: buys;
  sells: sells;
};

export type price = {
  item: simple_item_data;
  whitelisted: boolean;
  buys: buys;
  sells: sells;
};

export type buys = {
  quantity: number;
  unit_price: number;
};

export type sells = {
  quantity: number;
  unit_price: number;
};

export type ingredient = {
  item_id: number;
  item_count: number;
};

export type simple_item_data = {
  id: number;
  name: string | null;
};
export type recipe_item = {
  recipe_id: number;
  ingredient: ingredient;
};

export type recipe_discipline = {
  recipe_id: number;
  discipline: discipline;
};

export type recipe_response = {
  id: number;
  output_item_id: number;
  output_item_count: number;
  min_rating: number | null;
};

export type recipe_items_response = {};

export type price_response = {
  id: number;
  whitelisted: boolean;
  buys: buys;
  sells: sells;
};
