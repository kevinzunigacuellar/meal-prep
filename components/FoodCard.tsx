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
    <div>
      <h2>{name}</h2>
      <input value={weight} type="number" onChange={handleWeightChange} />
      <p>{`${units === 'g' ? 'grams' : 'ounces'}`}</p>
      <p>Calories: {calories}cal</p>
      <button onClick={addToMeal} type="button">
        add to meal
      </button>
    </div>
  )
}

export default FoodCard
