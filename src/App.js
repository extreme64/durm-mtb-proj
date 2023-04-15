import './App.css';
import BarChart from './BarChart';
import TrailMap from './components/TrailMap';

function App() {

  const data = {
    title: 'Sales',
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    values: [12, 19, 3, 5, 2, 3, 10],
    colors: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#00BFFF', '#9400D3'],
  };
  
  return (
    <div className="App">
      <header></header>
      <main>
        <TrailMap />
        <BarChart data={data} />
      </main>
    </div>
  );
}

export default App;
