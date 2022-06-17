import type { NextPage } from 'next'
import { useState, useMemo, useEffect, FunctionComponent, Dispatch, SetStateAction } from 'react'
import FoodCard from '../components/FoodCard'
import { UnitsContext } from '../context/UnitsContext'

const food = [
  {
    name: 'Chicken breast',
    caloriesPerGram: 1.2,
  },
  {
    name: 'Chicken thigh',
    caloriesPerGram: 2,
  },
  {
    name: 'Beef',
    caloriesPerGram: 3,
  },
  {
    name: 'Pork',
    caloriesPerGram: 4,
  },
  {
    name: 'Strawberry',
    caloriesPerGram: 0.5,
  },
]

interface Meal {
  name: string
  weight: number
  calories: number
}

const gramsToOunces = (grams: number) => grams / 28.3495

const OuncesToGrams = (ounces: number) => ounces * 28.3495

const Home: NextPage = () => {
  const [meal, setMeal] = useState<Meal[]>([])
  const [units, setUnits] = useState('g')

  // todo: fix unit converter in meals (hacky fix)
  useEffect(() => {
    if (units === 'oz') {
      setMeal(meal =>
        meal.map(mealItem => {
          const weight = gramsToOunces(mealItem.weight)
          return {
            ...mealItem,
            weight,
          }
        })
      )
    } else {
      setMeal(meal =>
        meal.map(mealItem => {
          const weight = OuncesToGrams(mealItem.weight)
          return {
            ...mealItem,
            weight,
          }
        })
      )
    }
  }, [units])

  const totalCalories = useMemo(() => {
    return meal.reduce((acc, curr) => acc + curr.calories, 0)
  }, [meal])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnits(e.target.value)
  }
  return (
    <UnitsContext.Provider value={{ units }}>
      <div className="lg:max-w-6xl mx-auto">
        <select name="units" id="units" onChange={handleSelect}>
          <option value="g">grams</option>
          <option value="oz">ounces</option>
        </select>
        <div className="grid grid-cols-3 gap-6">
          <Aside setMeal={setMeal} />
          <div className="col-span-2 border rounded-lg">
            <h1>Meal:</h1>
            <p>total calories: {totalCalories}cal</p>
            <div>
              {meal.map(meal => (
                <div key={meal.name}>
                  <div>{meal.name}</div>
                  <div>
                    {meal.weight.toFixed(2)} {units}
                  </div>
                  <div>{meal.calories}cal</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnitsContext.Provider>
  )
}

const Aside = ({ setMeal }: { setMeal: Dispatch<SetStateAction<Meal[]>> }) => {
  const [filter, setFilter] = useState('')
  const [foodList, setFoodList] = useState(food)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }

  return (
    <div className="">
      <h1>Search any food</h1>
      <div className="grid grid-cols-1 gap-6">
        <input type="text" onChange={handleChange} value={filter} />
        {foodList
          .filter(food => food.name.toLowerCase().includes(filter))
          .map((food, i) => (
            <FoodCard
              key={i}
              name={food.name}
              calPerGram={food.caloriesPerGram}
              setMeal={setMeal}
            />
          ))}
      </div>
    </div>
  )
}
export default Home
