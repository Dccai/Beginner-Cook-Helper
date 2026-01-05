import { query } from './database/postgres.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleRecipes = [
  {
    name: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
    difficulty: 'easy',
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    cuisine_type: 'Italian',
    ingredients: [
      { name: 'spaghetti', quantity: '400', unit: 'g' },
      { name: 'pancetta or bacon, diced', quantity: '200', unit: 'g' },
      { name: 'large eggs', quantity: '4', unit: '' },
      { name: 'Parmesan cheese, grated', quantity: '100', unit: 'g' },
      { name: 'garlic, minced', quantity: '2', unit: 'cloves' },
      { name: 'black pepper', quantity: 'to taste', unit: '' },
      { name: 'salt for pasta water', quantity: '', unit: '' }
    ],
    steps: [
      { order: 1, instruction: 'Bring a large pot of salted water to boil', duration: 5 },
      { order: 2, instruction: 'Cook spaghetti according to package directions until al dente', duration: 10 },
      { order: 3, instruction: 'Meanwhile, cook pancetta in a large skillet over medium heat until crispy', duration: 5 },
      { order: 4, instruction: 'In a bowl, whisk together eggs and Parmesan cheese', duration: 2 },
      { order: 5, instruction: 'Drain pasta, reserving 1 cup pasta water', duration: 1 },
      { order: 6, instruction: 'Add hot pasta to the skillet with pancetta, remove from heat', duration: 1 },
      { order: 7, instruction: 'Quickly stir in egg mixture, adding pasta water to create a creamy sauce', duration: 2 },
      { order: 8, instruction: 'Season generously with black pepper and serve immediately', duration: 1 }
    ]
  },
  {
    name: 'Chicken Stir Fry',
    description: 'Quick and healthy Asian-inspired chicken with colorful vegetables in a savory sauce.',
    difficulty: 'easy',
    prep_time: 15,
    cook_time: 15,
    servings: 4,
    cuisine_type: 'Asian',
    ingredients: [
      { name: 'chicken breast, sliced', quantity: '500', unit: 'g' },
      { name: 'bell peppers, sliced', quantity: '2', unit: '' },
      { name: 'broccoli florets', quantity: '200', unit: 'g' },
      { name: 'soy sauce', quantity: '3', unit: 'tbsp' },
      { name: 'sesame oil', quantity: '1', unit: 'tbsp' },
      { name: 'garlic, minced', quantity: '3', unit: 'cloves' },
      { name: 'ginger, grated', quantity: '1', unit: 'tbsp' },
      { name: 'vegetable oil', quantity: '2', unit: 'tbsp' }
    ],
    steps: [
      { order: 1, instruction: 'Heat vegetable oil in a large wok or skillet over high heat', duration: 2 },
      { order: 2, instruction: 'Add chicken and stir-fry until golden and cooked through', duration: 5 },
      { order: 3, instruction: 'Remove chicken and set aside', duration: 1 },
      { order: 4, instruction: 'Add more oil if needed, then stir-fry garlic and ginger until fragrant', duration: 1 },
      { order: 5, instruction: 'Add vegetables and stir-fry until tender-crisp', duration: 4 },
      { order: 6, instruction: 'Return chicken to the wok', duration: 1 },
      { order: 7, instruction: 'Add soy sauce and sesame oil, toss everything together', duration: 2 },
      { order: 8, instruction: 'Serve hot over rice', duration: 1 }
    ]
  },
  {
    name: 'Beef Tacos',
    description: 'Delicious Mexican tacos with seasoned ground beef and fresh toppings.',
    difficulty: 'easy',
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    cuisine_type: 'Mexican',
    ingredients: [
      { name: 'ground beef', quantity: '500', unit: 'g' },
      { name: 'taco seasoning', quantity: '2', unit: 'tbsp' },
      { name: 'taco shells', quantity: '8', unit: '' },
      { name: 'lettuce, shredded', quantity: '2', unit: 'cups' },
      { name: 'tomatoes, diced', quantity: '2', unit: '' },
      { name: 'cheddar cheese, shredded', quantity: '1', unit: 'cup' },
      { name: 'sour cream', quantity: '', unit: 'to taste' },
      { name: 'salsa', quantity: '', unit: 'to taste' }
    ],
    steps: [
      { order: 1, instruction: 'Brown ground beef in a large skillet over medium-high heat', duration: 8 },
      { order: 2, instruction: 'Drain excess fat from the beef', duration: 2 },
      { order: 3, instruction: 'Add taco seasoning and water as per package instructions', duration: 5 },
      { order: 4, instruction: 'Simmer until sauce thickens', duration: 3 },
      { order: 5, instruction: 'Warm taco shells according to package directions', duration: 5 },
      { order: 6, instruction: 'Fill each taco shell with seasoned beef', duration: 2 },
      { order: 7, instruction: 'Top with lettuce, tomatoes, cheese, sour cream, and salsa', duration: 3 }
    ]
  },
  {
    name: 'Homemade Pizza',
    description: 'Delicious pizza with homemade dough, tomato sauce, and your favorite toppings.',
    difficulty: 'medium',
    prep_time: 90,
    cook_time: 15,
    servings: 4,
    cuisine_type: 'Italian',
    ingredients: [
      { name: 'pizza dough', quantity: '500', unit: 'g' },
      { name: 'tomato sauce', quantity: '200', unit: 'ml' },
      { name: 'mozzarella cheese, shredded', quantity: '300', unit: 'g' },
      { name: 'olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'fresh basil leaves', quantity: '1', unit: 'handful' },
      { name: 'pepperoni (optional)', quantity: '100', unit: 'g' },
      { name: 'mushrooms, sliced (optional)', quantity: '100', unit: 'g' }
    ],
    steps: [
      { order: 1, instruction: 'Preheat oven to 475°F (245°C)', duration: 15 },
      { order: 2, instruction: 'Roll out pizza dough on a floured surface', duration: 10 },
      { order: 3, instruction: 'Transfer dough to a pizza stone or baking sheet', duration: 2 },
      { order: 4, instruction: 'Spread tomato sauce evenly over the dough', duration: 3 },
      { order: 5, instruction: 'Sprinkle mozzarella cheese over the sauce', duration: 2 },
      { order: 6, instruction: 'Add your desired toppings', duration: 5 },
      { order: 7, instruction: 'Drizzle with olive oil', duration: 1 },
      { order: 8, instruction: 'Bake for 12-15 minutes until crust is golden and cheese is bubbly', duration: 15 },
      { order: 9, instruction: 'Remove from oven, top with fresh basil, slice and serve', duration: 3 }
    ]
  },
  {
    name: 'Thai Green Curry',
    description: 'Aromatic and spicy Thai curry with chicken, vegetables, and coconut milk.',
    difficulty: 'medium',
    prep_time: 20,
    cook_time: 25,
    servings: 4,
    cuisine_type: 'Asian',
    ingredients: [
      { name: 'chicken thighs, cubed', quantity: '500', unit: 'g' },
      { name: 'green curry paste', quantity: '3', unit: 'tbsp' },
      { name: 'coconut milk', quantity: '400', unit: 'ml' },
      { name: 'bell peppers, sliced', quantity: '2', unit: '' },
      { name: 'bamboo shoots', quantity: '1', unit: 'can' },
      { name: 'Thai basil leaves', quantity: '1', unit: 'handful' },
      { name: 'fish sauce', quantity: '2', unit: 'tbsp' },
      { name: 'brown sugar', quantity: '1', unit: 'tbsp' },
      { name: 'lime juice', quantity: '2', unit: 'tbsp' }
    ],
    steps: [
      { order: 1, instruction: 'Heat a large pan or wok over medium-high heat', duration: 2 },
      { order: 2, instruction: 'Add curry paste and cook until fragrant', duration: 2 },
      { order: 3, instruction: 'Add half of the coconut milk and stir to combine', duration: 3 },
      { order: 4, instruction: 'Add chicken and cook until no longer pink', duration: 8 },
      { order: 5, instruction: 'Add remaining coconut milk, vegetables, and bamboo shoots', duration: 3 },
      { order: 6, instruction: 'Simmer for 10 minutes until vegetables are tender', duration: 10 },
      { order: 7, instruction: 'Stir in fish sauce, brown sugar, and lime juice', duration: 2 },
      { order: 8, instruction: 'Add Thai basil leaves and serve over rice', duration: 2 }
    ]
  },
  {
    name: 'Grilled Salmon with Lemon',
    description: 'Simple and healthy grilled salmon with fresh lemon and herbs.',
    difficulty: 'medium',
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    cuisine_type: 'Mediterranean',
    ingredients: [
      { name: 'salmon fillets', quantity: '4', unit: 'pieces' },
      { name: 'lemon, sliced', quantity: '2', unit: '' },
      { name: 'olive oil', quantity: '3', unit: 'tbsp' },
      { name: 'garlic, minced', quantity: '3', unit: 'cloves' },
      { name: 'fresh dill', quantity: '2', unit: 'tbsp' },
      { name: 'salt', quantity: '', unit: 'to taste' },
      { name: 'black pepper', quantity: '', unit: 'to taste' }
    ],
    steps: [
      { order: 1, instruction: 'Preheat grill to medium-high heat', duration: 10 },
      { order: 2, instruction: 'Mix olive oil, garlic, and dill in a small bowl', duration: 2 },
      { order: 3, instruction: 'Season salmon fillets with salt and pepper', duration: 1 },
      { order: 4, instruction: 'Brush salmon with the oil mixture', duration: 2 },
      { order: 5, instruction: 'Place salmon skin-side down on the grill', duration: 1 },
      { order: 6, instruction: 'Grill for 6-8 minutes per side', duration: 14 },
      { order: 7, instruction: 'Top with fresh lemon slices and serve', duration: 2 }
    ]
  },
  {
    name: 'Veggie Fried Rice',
    description: 'Quick and easy vegetarian fried rice with mixed vegetables.',
    difficulty: 'easy',
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    cuisine_type: 'Asian',
    ingredients: [
      { name: 'cooked rice, day-old', quantity: '4', unit: 'cups' },
      { name: 'mixed vegetables', quantity: '2', unit: 'cups' },
      { name: 'eggs', quantity: '2', unit: '' },
      { name: 'soy sauce', quantity: '3', unit: 'tbsp' },
      { name: 'sesame oil', quantity: '1', unit: 'tbsp' },
      { name: 'garlic, minced', quantity: '3', unit: 'cloves' },
      { name: 'green onions, chopped', quantity: '3', unit: '' },
      { name: 'vegetable oil', quantity: '2', unit: 'tbsp' }
    ],
    steps: [
      { order: 1, instruction: 'Heat oil in a large wok over high heat', duration: 2 },
      { order: 2, instruction: 'Scramble eggs in the wok, then set aside', duration: 3 },
      { order: 3, instruction: 'Add more oil and stir-fry garlic until fragrant', duration: 1 },
      { order: 4, instruction: 'Add mixed vegetables and stir-fry until tender', duration: 4 },
      { order: 5, instruction: 'Add rice and break up any clumps', duration: 3 },
      { order: 6, instruction: 'Add soy sauce and sesame oil, stir well', duration: 2 },
      { order: 7, instruction: 'Add scrambled eggs back to the wok', duration: 1 },
      { order: 8, instruction: 'Garnish with green onions and serve hot', duration: 1 }
    ]
  },
  {
    name: 'Beef Lasagna',
    description: 'Classic Italian lasagna with layers of pasta, meat sauce, and cheese.',
    difficulty: 'hard',
    prep_time: 30,
    cook_time: 60,
    servings: 8,
    cuisine_type: 'Italian',
    ingredients: [
      { name: 'lasagna noodles', quantity: '12', unit: 'sheets' },
      { name: 'ground beef', quantity: '500', unit: 'g' },
      { name: 'marinara sauce', quantity: '800', unit: 'ml' },
      { name: 'ricotta cheese', quantity: '500', unit: 'g' },
      { name: 'mozzarella cheese, shredded', quantity: '400', unit: 'g' },
      { name: 'Parmesan cheese, grated', quantity: '100', unit: 'g' },
      { name: 'egg', quantity: '1', unit: '' },
      { name: 'garlic, minced', quantity: '4', unit: 'cloves' },
      { name: 'Italian herbs', quantity: '2', unit: 'tbsp' }
    ],
    steps: [
      { order: 1, instruction: 'Preheat oven to 375°F (190°C)', duration: 10 },
      { order: 2, instruction: 'Cook lasagna noodles according to package directions', duration: 12 },
      { order: 3, instruction: 'Brown ground beef with garlic, drain fat', duration: 10 },
      { order: 4, instruction: 'Add marinara sauce and herbs to beef, simmer', duration: 15 },
      { order: 5, instruction: 'Mix ricotta cheese with egg', duration: 3 },
      { order: 6, instruction: 'Spread thin layer of meat sauce in baking dish', duration: 2 },
      { order: 7, instruction: 'Layer noodles, ricotta mixture, meat sauce, and mozzarella', duration: 8 },
      { order: 8, instruction: 'Repeat layers twice more', duration: 8 },
      { order: 9, instruction: 'Top with remaining mozzarella and Parmesan', duration: 2 },
      { order: 10, instruction: 'Cover with foil and bake for 45 minutes', duration: 45 },
      { order: 11, instruction: 'Remove foil, bake 15 more minutes until golden', duration: 15 },
      { order: 12, instruction: 'Let rest 10 minutes before serving', duration: 10 }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    for (const recipeData of sampleRecipes) {
      const recipeResult = await query(
        `INSERT INTO recipes (name, description, difficulty, prep_time, cook_time, servings, cuisine_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          recipeData.name,
          recipeData.description,
          recipeData.difficulty,
          recipeData.prep_time,
          recipeData.cook_time,
          recipeData.servings,
          recipeData.cuisine_type
        ]
      );

      const recipeId = recipeResult.rows[0].id;
      console.log(`Created recipe: ${recipeData.name} (ID: ${recipeId})`);
      for (const ingredient of recipeData.ingredients) {
        await query(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit)
           VALUES ($1, $2, $3, $4)`,
          [recipeId, ingredient.name, ingredient.quantity, ingredient.unit]
        );
      }

      for (const step of recipeData.steps) {
        await query(
          `INSERT INTO recipe_steps (recipe_id, step_order, instruction, duration)
           VALUES ($1, $2, $3, $4)`,
          [recipeId, step.order, step.instruction, step.duration]
        );
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();