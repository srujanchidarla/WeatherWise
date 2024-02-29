import './App.css';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Search></Search>
        <WeatherCard></WeatherCard>
      </header>
    </div>
  );
}

export default App;
