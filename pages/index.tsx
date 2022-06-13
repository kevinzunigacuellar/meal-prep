import type { NextPage } from 'next'
import { useState, useMemo, useContext, createContext, useEffect } from 'react'

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

interface FoodProps {
  name: string
  calPerGram: number
  setMeal: React.Dispatch<React.SetStateAction<Meal[]>>
}

const Home: NextPage = () => {
  const [filter, setFilter] = useState('')
  const [foodList, setfoodList] = useState(food)
  const [meal, setMeal] = useState<Meal[]>([])
  const [units, setUnits] = useState('g')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }
  // todo: fix unit converter in meals
  useEffect(() => {
    if (units === 'oz') {
      setMeal(meal =>
        meal.map(mealItem => {
          const weight = mealItem.weight / 28.35
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
      <UnitsContext.Provider value={units}>
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
              <Food key={i} name={food.name} calPerGram={food.caloriesPerGram} setMeal={setMeal} />
            ))}
        </ul>
        <h1>Meal:</h1>
        <p>total calories: {totalCalories}cal</p>
        <div>
          {meal.map(meal => (
            <div key={meal.name}>
              <div>{meal.name}</div>
              <div>
                {meal.weight} {units}
              </div>
              <div>{meal.calories}cal</div>
            </div>
          ))}
        </div>
      </UnitsContext.Provider>
    </div>
  )
}

const Food = ({ name, calPerGram, setMeal }: FoodProps) => {
  const [weight, setWeight] = useState(100)
  const units = useContext(UnitsContext)

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value))
  }

  const calories = useMemo(() => {
    if (units === 'g') {
      return calPerGram * weight
    }
    return weight * calPerGram * 28.3495
  }, [weight, calPerGram, units])

  const addToMeal = () => {
    setMeal((meal: Meal[]) => [...meal, { name, weight, calories }])
  }
  return (
    <div>
      <p>{name}</p>
      <input type="number" value={weight} onChange={handleWeightChange} />
      <p>{`${weight} ${units}`}</p>
      <p>{calories}cal</p>
      <button onClick={addToMeal}>add to meal</button>
    </div>
  )
}

const UnitsContext = createContext({})

export default Home
