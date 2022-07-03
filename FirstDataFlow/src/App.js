import logo from './logo.svg';
import {useState} from 'react';
import './App.css';

function Button(props) {
	return (
      <button onClick={() => props.onClickFunction(props.number)}>
        {props.sign}{props.number}
      </button>
    );
}

function Display(props){
  return (
    <>      {props.message}    </>
  );
}
function App(){
  const numbers = [1, 5, 10, 100];
  
  const [counter, setCounter] = useState(42);
  const incrementCounter = (incrementValue) => setCounter(counter+incrementValue);
  const decrementCounter = (decrementValue) => setCounter(counter-decrementValue);
  return (
      <>
        <Button onClickFunction={decrementCounter} number={1} sign='-' />
        <Button onClickFunction={decrementCounter} number={5} sign='-' />
        <Button onClickFunction={decrementCounter} number={10} sign='-' />
        <Button onClickFunction={decrementCounter} number={100} sign='-' />
        <Display message={counter}/>
        <Button onClickFunction={incrementCounter} number={1} sign='+' />
        <Button onClickFunction={incrementCounter} number={5} sign='+' />
        <Button onClickFunction={incrementCounter} number={10} sign='+' />
        <Button onClickFunction={incrementCounter} number={100} sign='+' />

      </>
  );
}
// ReactDOM.render(
//   <App />, 
//   document.getElementById('mountNode'),
// );

export default App;
