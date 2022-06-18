import { useState, useMemo, useContext, ChangeEvent } from 'react'
import { UnitsContext } from '../context/UnitsContext'
import type { Meal } from '../types'

interface FoodProps {
  name: string
  calPerGram: number
  setMeal: React.Dispatch<React.SetStateAction<Meal[]>>
}

const FoodCard = ({ name, calPerGram, setMeal }: FoodProps) => {
  const [weight, setWeight] = useState(100)
  const { units } = useContext(UnitsContext)

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value))
  }

  const calories = useMemo(() => {
    if (units === 'g') {
      return Math.ceil(weight * calPerGram)
    }
    return Math.ceil(weight * calPerGram * 28.3495)
  }, [weight, calPerGram, units])

  const addToMeal = () => {
    setMeal((meal: Meal[]) => [...meal, { name, weight, calories }])
  }
  return (
    <div className="bg-white p-6 w-full flex-shrink-0 sm:max-w-sm rounded-md border flex flex-col gap-4">
      <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
      <div className="flex items-baseline gap-2 justify-between">
        <div>
          <input
            value={weight}
            type="number"
            id="weight"
            onChange={handleWeightChange}
            className="rounded-md w-20 mr-2"
          />
          <label htmlFor="weight" className="text-sm">{`${
            units === 'g' ? 'grams' : 'ounces'
          }`}</label>
        </div>
        <p>{calories} cal</p>
      </div>
      <button
        onClick={addToMeal}
        type="button"
        className="bg-zinc-900 text-white w-full py-2 rounded-md"
      >
        Add to meal
      </button>
    </div>
  )
}

export default FoodCard
