import type { NextPage } from 'next'
import { useState, useMemo, useEffect } from 'react'
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
  const [filter, setFilter] = useState('')
  const [foodList, setfoodList] = useState(food)
  const [meal, setMeal] = useState<Meal[]>([])
  const [units, setUnits] = useState('g')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }
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
    <div>
      <UnitsContext.Provider value={{ units }}>
        <input type="text" onChange={handleChange} />
        <select name="units" id="units" onChange={handleSelect}>
          <option value="g">grams</option>
          <option value="oz">ounces</option>
        </select>
        <p>{units}</p>
        <pre>{filter}</pre>
        <ul>
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
        </ul>
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
      </UnitsContext.Provider>
    </div>
  )
}

export default Home
