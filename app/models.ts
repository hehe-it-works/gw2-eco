export type full_item_data = {
  id: number;
  name: string | null;
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

export type ingredient = {
  item_id: number;
  count: number;
};

export type simple_item_data = {
  id: number;
  name: string | null;
};
export type recipe_item = {
  recipe_id: number;
  ingredient: ingredient;
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

export type recipe_discipline = {
  recipe_id: number;
  discipline: discipline;
};

export type recipe_response = {
  id: number;
  output_item_id: number;
  output_item_count: number;
  disciplines: string[];
  min_rating: number;
  ingredients: ingredient[];
};

export type price_response = {
  id: number;
  whitelisted: boolean;
  buys: buys;
  sells: sells;
};
