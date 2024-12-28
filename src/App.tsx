import './App.css'
import background from './assets/card-background.png'
import Card from './components/Card'
import dog from './assets/dog.png'
import bird from './assets/bird.png'
import baby from './assets/baby.png'
import bat from './assets/bat.png'

function App() {
  
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
        <Card size={150} image={dog} background={background}/>
        <Card size={150} image={bat} background={background}/>
        <Card size={150} image={baby} background={background}/>
        <Card size={150} image={baby} background={background}/>
        </div>
        <div className="cards-line">
        <Card size={150} image={bird} background={background}/>
        <Card size={150} image={bird} background={background}/>
        <Card size={150} image={dog} background={background}/>
        <Card size={150} image={bat} background={background}/>
        </div>
      </div>
    </div>
  )
}

export default App
