import './App.css'
import background from './assets/card-background.png'
import Card from './components/Card'
import dog from './assets/dog.png'
import bird from './assets/bird.png'
import baby from './assets/baby.png'
import bat from './assets/bat.png'
import { useEffect, useState } from 'react'

function App() {

  const [cards, setCards] = useState<{hovered:boolean, selected:boolean, collected:boolean, image:string}[]>([
    {hovered: false, image:dog, selected: false, collected: false},
    {hovered: false, image:dog, selected: false, collected: false},
    {hovered: false, image:baby, selected: false, collected: false},
    {hovered: false, image:baby, selected: false, collected: false},
    {hovered: false, image:bird, selected: false, collected: false},
    {hovered: false, image:bird, selected: false, collected: false},
    {hovered: false, image:bat, selected: false, collected: false},
    {hovered: false, image:bat, selected: false, collected: false},
  ])
  
  const searchForCollected = () => {
    //copia profunda dos objetos de cards
    const result = cards.map((item) => {return {...item}});
    let hasChanged = false;
    let cardCount = 0;
    for(const card of result) {
      //console.log('aunaunauna')
      if(!card.selected || card.collected) continue;
      cardCount++;
      const image = card.image;
      const items = cards.filter((item) => item.image == image && item.selected);
      if(items.length > 1) {
        hasChanged = true;
        for(const item of result) {
          if(item.image != image) continue;
          item.collected = true;
          item.selected = false;
        }
      }
    }
    if(hasChanged) {setCards(result); return;};
    if(cardCount < 2) return;

    for(const card of result) {
      card.selected = false;
      card.hovered = false;
    }
    setCards(result);
  }
  
  useEffect(() => {
    searchForCollected();
  })
  //console.log(cards);

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
            image={card.image} background={background} key={index} setCards={setCards} collected={card.collected}/>
          }).slice(0,4)}
        </div>
        <div className="cards-line">
        {cards.map((card, index) => {
            return <Card id={index} hovererd={card.hovered} size={150} selected={card.selected}
            image={card.image} background={background} key={index} setCards={setCards} collected={card.collected}/>
          }).slice(4)}
        </div>
      </div>
    </div>
  )
}

export default App
