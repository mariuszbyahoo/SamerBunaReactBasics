import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

const StarsDisplay = props => (
    <>
        {utils.range(1, props.count).map(starId =>
            <div key={starId} className="star" />
        )}
    </>
);

const PlayNumber = props => (
    <button
        key={props.number}
        className="number"
        style={{ backgroundColor: colors[props.status] }}
        onClick={() => props.onNumberClick(props.number, props.status)}>
        {props.number}
    </button>
);

const PlayAgain = props => (
    <div className="game-done">
        <div
            className="message"
            style={{
                color: props.gameStatus === 'lost' ? 'red' : 'green'
        }}>
            {
                props.gameStatus === 'lost'
                    ?
                    'GameOver' :
                    'Nice'
            }
        </div>
        <button onClick={props.onClick}>Play again</button>
    </div>
);

// Propper React Component structure:
function Game(props) {
    // 1. used Hooks
    const [stars, setStars] = useState(utils.random(Number("1"), 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondsLeft, setSecondsLeft] = useState(10);
    // setTimeout

    useEffect(() => {
        if (secondsLeft > 0 && availableNums.length > 0) {
            const timerId = setTimeout(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        }
    });

    // 2. computations
    const candidatesAreWrong = utils.sum(candidateNums) > stars;

    const gameStatus =
        availableNums.length === 0 ? 'won' :
        secondsLeft === 0 ? 'lost' : 'active';

    const gameIsWon = availableNums.length === 0;
    const gameIsLost = secondsLeft === 0;

    // poniżej początkowa wersja zresetowania gry - poprawnie zamiast resetować ją należy
    // enkapsulować komponent "Game" i w razie kliknięcia "Play again" po prostu zdemontować
    // stary komponent "Game" i zamontować nowy.
    //const resetGame = () => {
    //    setStars(utils.random(Number("1"), 9));
    //    setAvailableNums(utils.range(1, 9));
    //    setCandidateNums([]);
    //}

    const numberStatus = (number) => {
        if (!availableNums.includes(number)) {
            return 'used';
        }
        if (candidateNums.includes(number)) {
            return candidatesAreWrong ? 'wrong' : 'candidate';
        }
        return 'available';
    };

    const onNumberClick = (number, currentStatus) => {
        // currentStatus => newStatus
        if (gameStatus !== 'active' || currentStatus == 'used') {
            return;
        }
        // candidateNums
        const newCandidateNums =
            currentStatus === 'available'
                ? candidateNums.concat(number)
                : candidateNums.filter(cn => cn !== number);
        if (utils.sum(newCandidateNums) !== stars) {
            setCandidateNums(newCandidateNums);
        } else {
            const newAvailableNums = availableNums.filter(
                n => !newCandidateNums.includes(n)
            );
            // redraw (from what is avaialble)
            setStars(utils.randomSumIn(newAvailableNums, 9));
            setAvailableNums(newAvailableNums);
            setCandidateNums([]);
        }
    }

    // 4. return statement 

    return (
        <div className="game">
            <div className="help">
                Pick 1 or more numbers that sum to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {gameStatus !== 'active' ? (
                        <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
                        ) : (
                            <StarsDisplay count = { stars } />
                    )}
                </div>
                <div className="right">
                    {utils.range(1, 9).map(number =>
                        <PlayNumber
                            key={number}
                            number={number}
                            status={numberStatus(number)}
                            onNumberClick={onNumberClick}
                        />
                    )}
                </div>
            </div>
            <div className="timer">Time Remaining: {secondsLeft}</div>
        </div>
    );
};

const StarMatch = () => {
    const [gameId, setGameId] = useState(1);
    return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
}

// Color Theme
const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
};

// Math science
const utils = {
    // Sum an array
    sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

    // create an array of numbers between min and max (edges included)
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

    // pick a random number between min and max (edges included)
    random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

    // Given an array of numbers and a max...
    // Pick a random sum (< max) from the set of all available sums in arr
    randomSumIn: (arr, max) => {
        const sets = [[]];
        const sums = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0, len = sets.length; j < len; j++) {
                const candidateSet = sets[j].concat(arr[i]);
                const candidateSum = utils.sum(candidateSet);
                if (candidateSum <= max) {
                    sets.push(candidateSet);
                    sums.push(candidateSum);
                }
            }
        }
        return sums[utils.random(0, sums.length - 1)];
    },
};

export default StarMatch;
