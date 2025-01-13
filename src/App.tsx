import './App.css'
import background from './assets/card-background.png'
import Card from './components/Card'
import dog from './assets/dog.png'
import bird from './assets/bird.png'
import baby from './assets/baby.png'
import bat from './assets/bat.png'
import reload from './assets/reload-icon.svg'
import { useEffect, useState } from 'react'

export type cardObject = {
  hovered:boolean, selected:boolean, collected:boolean, image:string,
    reset:boolean, reboot: boolean
}

function App() {

  const shuffleCards: (list:cardObject[]) => cardObject[] = (list) => {
    
    for(let i = 0; i < list.length; i++) {
      const index = Math.floor(Math.random() * list.length);
      const tmp = list[i].image;
      list[i].image = list[index].image;
      list[index].image = tmp;
    }

    //reset all values to false
    for(let i = 0; i < list.length; i++){
      list[i].collected = false;
      list[i].hovered = false;
      list[i].reset = false;
      list[i].selected = false;
      list[i].reboot = true;
    }

    return [...list];

  }

  const [cards, setCards] = useState<cardObject[]>([
    {hovered: false, image:dog, selected: false, collected: false, reset:false, reboot: true},
    {hovered: false, image:dog, selected: false, collected: false, reset: false, reboot: false},
    {hovered: false, image:baby, selected: false, collected: false, reset: false, reboot: true},
    {hovered: false, image:baby, selected: false, collected: false, reset: false, reboot: false},
    {hovered: false, image:bird, selected: false, collected: false, reset: false, reboot: false},
    {hovered: false, image:bird, selected: false, collected: false, reset: false, reboot: false},
    {hovered: false, image:bat, selected: false, collected: false, reset: false, reboot: false},
    {hovered: false, image:bat, selected: false, collected: false, reset: false, reboot: false}
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
        break;
      }
    }
    if(hasChanged) {setCards(result); return;};
    if(cardCount < 2) return;
    //caso tenha duas ou mais cartas selecionadas
    for(const card of result) {
      if(card.selected) {
        console.log('setting to true');
        card.reset = true;
      }
      card.selected = false;
      card.hovered = false;
    }
    setCards(result);
  }

  useEffect(() => {
    setCards(shuffleCards(cards));
  }, [])
  
  useEffect(() => {
    console.log('render');
    searchForCollected();
  })

  return (
    <div className="main-container">
      <div className="header">
        <div className="title">
          <h2>Memory Game</h2>
        </div>
        <div
        onPointerDown={() => {setCards(shuffleCards(cards))}}
        className="reboot-button">
          <img src={reload} />
        </div>
      </div>
      <div className="game-container">
        <div className="cards-line">
          {cards.map((card, index) => {
            return <Card setCards={setCards} key={index} id={index} config={card} background={background} size={150}/>
          }).slice(0,4)}
        </div>
        <div className="cards-line">
        {cards.map((card, index) => {
            return <Card setCards={setCards} key={index} id={index} config={card} background={background} size={150}/>
          }).slice(4)}
        </div>
      </div>
    </div>
  )
}

export default App
