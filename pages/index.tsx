import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useMemo, useEffect, Dispatch, SetStateAction } from 'react'
import FoodCard from '../components/FoodCard'
import { UnitsContext } from '../context/UnitsContext'

const food = [
  {
    name: 'Chicken breast',
    caloriesPerGram: 1.65,
  },
  {
    name: 'Chicken thigh',
    caloriesPerGram: 1.77,
  },
  {
    name: 'Salmon',
    caloriesPerGram: 2.08,
  },
  {
    name: 'Rice',
    caloriesPerGram: 1.3,
  },
  {
    name: 'Kiwi',
    caloriesPerGram: 0.61,
  },
  {
    name: 'Strawberry',
    caloriesPerGram: 0.33,
  },
  {
    name: 'Brocolli',
    caloriesPerGram: 0.34,
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

  const handleDeleteMeal = (index: number) => {
    setMeal(meals => meals.filter((_, i) => i !== index))
  }

  const totalCalories = useMemo(() => {
    return meal.reduce((acc, curr) => acc + curr.calories, 0)
  }, [meal])

  return (
    <>
      <Head>
        <title>Meal prep calculator</title>
      </Head>
      <UnitsContext.Provider value={{ units }}>
        <div className="lg:max-w-6xl lg:mx-auto p-4">
          <h1 className="text-xl sm:text-4xl font-bold mb-6">🍤 Meal prep tool</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 sm:gap-6" id="layout">
            <FoodList setMeal={setMeal} setUnits={setUnits} />
            <div className="col-span-2">
              <div className="flex items-baseline justify-between my-2">
                <h2 className="text-xl font-semibold sm:text-3xl">Meal:</h2>
                <p>Current cal: {totalCalories}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {meal.map((meal, i) => (
                  <div key={meal.name} className="border rounded-md p-6">
                    <div>{meal.name}</div>
                    <div>
                      {Math.round(meal.weight)} {units}
                    </div>
                    <div>{meal.calories} cal</div>
                    <button onClick={() => handleDeleteMeal(i)}>delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </UnitsContext.Provider>
    </>
  )
}

interface FoodListProps {
  setMeal: Dispatch<SetStateAction<Meal[]>>
  setUnits: Dispatch<SetStateAction<string>>
}

const FoodList = ({ setMeal, setUnits }: FoodListProps) => {
  const [filter, setFilter] = useState('')
  const [foodList, setFoodList] = useState(food)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnits(e.target.value)
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input type="text" onChange={handleChange} value={filter} className="w-full rounded-md" />
        <select name="units" id="units" onChange={handleSelect} className="w-26 rounded-md">
          <option value="g">grams</option>
          <option value="oz">ounces</option>
        </select>
      </div>
      <div className="flex lg:flex-col gap-6 overflow-x-auto pb-4">
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
