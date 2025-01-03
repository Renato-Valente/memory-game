import './App.css'
import background from './assets/card-background.png'
import Card from './components/Card'
import dog from './assets/dog.png'
import bird from './assets/bird.png'
import baby from './assets/baby.png'
import bat from './assets/bat.png'
import { useState } from 'react'

function App() {

  const [cards, setCards] = useState<{hovered:boolean, selected:boolean, image:string}[]>([
    {hovered: false, image:dog, selected: false},{hovered: false, image:dog, selected: false},
    {hovered: false, image:dog, selected: false},{hovered: false, image:dog, selected: false},
    {hovered: false, image:dog, selected: false},{hovered: false, image:dog, selected: false},
    {hovered: false, image:dog, selected: false},{hovered: false, image:dog, selected: false},
  ])
  
  return (
    <div className="main-container">
      <div className="header">
        <div className="title">
          <h2>Memory Game</h2>
        </div>
        <div className="reboot-button"></div>
      </div>
      <div className="game-container">
        <div className="cards-line">
          {cards.map((card, index) => {
            return <Card id={index} hovererd={card.hovered} size={150} selected={card.selected}
            image={card.image} background={background} key={index} setCards={setCards}/>
          }).slice(0,4)}
        </div>
        <div className="cards-line">
        {cards.map((card, index) => {
            return <Card id={index} hovererd={card.hovered} size={150} selected={card.selected}
            image={card.image} background={background} key={index} setCards={setCards}/>
          }).slice(4)}
        </div>
      </div>
    </div>
  )
}

export default App
