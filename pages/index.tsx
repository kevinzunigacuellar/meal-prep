import type { NextPage } from 'next'
import { useState } from 'react'

const food = [
  {
    name: 'Chicken breast',
    calories: 200,
    weight: {
      units: 'g',
      value: 100,
    },
  },
  {
    name: 'Chicken thigh',
    calories: 300,
    weight: {
      units: 'g',
      value: 100,
    },
  },
  {
    name: 'Beef',
    calories: 200,
    weight: {
      units: 'g',
      value: 100,
    },
  },
  {
    name: 'Pork',
    calories: 200,
    weight: {
      units: 'g',
      value: 100,
    },
  },
  {
    name: 'Strawberry',
    calories: 40,
    weight: {
      units: 'g',
      value: 100,
    },
  },
]

const Home: NextPage = () => {
  const [filter, setFilter] = useState('')
  const [foods, setFoods] = useState(food)
  const [calories, setCalories] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }
  return (
    <div>
      <input type="text" onChange={handleChange} />
      <pre>{filter}</pre>
      <ul>
        {foods
          .filter(food => food.name.toLowerCase().includes(filter))
          .map(food => (
            <Food name={food.name} initialWeight={food.weight} />
          ))}
      </ul>
    </div>
  )
}

const Food = ({ name, initialWeight }: any) => {
  const [weight, setWeight] = useState(initialWeight.value)

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)
  }

  return (
    <div>
      <p>{name}</p>
      <input type="number" value={weight.value} onChange={handleWeightChange} />
      <p>
        {weight.value} {weight.units}
      </p>
    </div>
  )
}

export default Home
