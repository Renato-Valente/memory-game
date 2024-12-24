import './App.css'
import Card from './components/Card'

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
        <Card size={100}/><Card size={100}/><Card size={100}/><Card size={100}/><Card size={100}/>
        </div>
        <div className="cards-line">
        <Card size={100}/><Card size={100}/><Card size={100}/><Card size={100}/><Card size={100}/>
        </div>
      </div>
    </div>
  )
}

export default App
