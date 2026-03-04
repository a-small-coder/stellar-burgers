import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import {
  selectBun,
  selectIngredients
} from '../../services/slices/constructor';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector(selectBun);
  const constructorIngredients = useSelector(selectIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    if (Array.isArray(constructorIngredients)) {
      constructorIngredients.forEach((ingredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
