import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


// TODO: dodaj serwis HTTP!

const CardList = (props) => (
  <div>
      {props.proflies.map(profile => <CardFunc key={profile.id} {...profile}/>)}
  </div>
);

const CardFunc = (props) => (
  <div className="github-profile" style={{ margin: '1rem' }}>
        <img src={props.avatar_url} />
        <div className='info' 
            style={{ display: 'inline-block', marginLeft: 10 }}>
          <div className="name" style={{ fontSize: "125%" }}>{props.name}</div>
          <div className="company">{props.company}</div>
        </div>
      </div>
);

class Card extends React.Component {
  render() {
    const profile = this.props;
    return (
      // Poniżej podwójne curly braces - JavaScriptowy 
      // Object a w nim Object Literal   - {{}}
      // to jest normalny Dynamic Expression Syntax 
      // wprowadzony przez JSX
      <div className="github-profile" style={{ margin: '1rem' }}>
        <img src={profile.avatar_url} />
        <div className='info' 
            style={{ display: 'inline-block', marginLeft: 10 }}>
          <div className="name" style={{ fontSize: "125%" }}>{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    );
  }
}

const FormFunc = (props) => {
  const [userName, setUserName] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await axios.get(`https://api.github.com/users/${userName}`);
    props.onSubmit(resp.data);
    setUserName('');
 }
 return (
  <form onSubmit={handleSubmit}>
    <input 
      type="text" 
      placeholder="Github username" 
      value={ userName }
      onChange={event => setUserName(event.target.value)}
      required 
    />
    <button>Add card</button>
  </form>
 )
};

class Form extends React.Component {  
  // Zakomentowana jedna droga do używania userTextInput (w to zawiera się użycie
  // atrybutu ref w polu input)
  
  // userNameInput = React.createRef();

  // handleSubmit = (event) =>{
  //   event.preventDefault();
  //   console.log(
  //     this.userNameInput.current.value
  //   )
  // };

  // sample GithubUsers names : gaearon, gaeron, sophiebits, sebmarkbage, bvaughn
  state = { userName: '' };

  handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`)
    if(resp.response.status != 404){
      this.props.onSubmit(resp.data);
    }
    else{
      window.alert('Not found');
    }
    this.setState({ userName: ''})
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          placeholder="Github username" 
          value={ this.state.userName }
          onChange={event => this.setState({ userName: event.target.value })}
//          ref={this.userNameInput} 
          required 
        />
        <button>Add card</button>
      </form>
    )
  }
}

export default function AppFunc (props) {

  const [profiles] = useState([]); // UŻYWAJĄC TABLIC NIE UŻYWAJ SETTERA - DO TEGO JEST arr.push(obj) !!!!!!!!

  // UWAGA - W Poniższym IF, jeśli nie umieszczę średnika na koniec linijek to wtedy funkcja addNewProfile rzuci cichego exception.
  // tzn. - po dodaniu profilu do listy w ogóle nie uwidoczni się on na ekranie.
  const addNewProfile = (profileData) => {
    if (profiles.find(arr => arr.id === profileData.id) === undefined) {
      console.log('profiles', profiles);
      profiles.push(profileData);
      console.log('profile added', profileData);
      console.log('profiles', profiles);
    } else {
      window.alert('This profile has already been added!')
    }
  }
// Po dodaniu nowego profilu teraz tablica w komponencie AppFunc się zmienia, ale props obiektu CardList pozostaje takie samo.
  return (
    <div>
      <div className="header">{props.title}</div>
      <FormFunc onSubmit={addNewProfile} />
      <CardList proflies={profiles} /> 
    </div>
  );
}

class App extends React.Component {
  
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     profiles: testData
  //   };
  //}
  
  // Poniżej skrócona, uproszczona wersja która niedługo może stać się oficjalną 
  // składnią Reacta
  state = {
    profiles: [],
  };

  addNewProfile = (profileData) => {
    // poniżej przykład Spread Operator Syntax - robi to samo co wywołanie funkcji 
    // array.concat i składanie nowej tablicy

    if (this.state.profiles.find(profile => profile.id === profileData.id) === undefined) {
      this.setState(prevState => ({
        profiles: [...prevState.profiles, profileData]
      }))
    } else{
      window.alert('This profile has already been added!')
    }
  }

  render(){
    return ( 
      <div>
        <div className="header">{this.props.title}</div>
        <FormFunc onSubmit={this.addNewProfile}/>
        <CardList proflies={this.state.profiles} />
      </div>
    );
  }

}



// export default App;
