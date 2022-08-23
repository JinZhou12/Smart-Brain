import React, { Component } from 'react';
import Navigation from './Navigation/Navigation';
import ParticleEffect from './Particles/Particles';
import Logo from './Logo/Logo';
import Rank from './Rank/Rank';
import SignIn from './SignIn/SignIn';
import Register from './Register/Register';
import ImageLinkForm from './ImageLinkForm/ImageLinkForm';
import FaceRecognition from './FaceRecognition/FaceRecognition';
import './App.css';

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signIn',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component {

    constructor() {
        super();
        this.state = initialState;
    }

    render() {
        const { isSignedIn, route, imageUrl, box }  = this.state;
        return (
          <div className="App">
            <ParticleEffect />
            <div className='flex justify-between'>
                <Logo />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/> 
            </div>
            { route === 'home'
                ? <div>
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                    <ImageLinkForm onInputChange={this.onInputChange} 
                        onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box} imageUrl={imageUrl}/>
                  </div>
              : (
                (route === 'signIn' || route ==='signOut')
                  ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
            }
          </div>
        );
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            rightCol: width - (clarifaiFace.right_col * width),
            topRow: clarifaiFace.top_row * height,
            bottomRow: height - (clarifaiFace.bottom_row * height),
        }
    }

    displayFaceBox = (box) => {
        this.setState({ box: box });
    }

    loadUser = (data) => {
        this.setState({user:{
            id: data.user_id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = () => {
        this.setState({ box:{} });
        this.setState({ imageUrl: this.state.input });
        fetch('https://shrouded-plains-66034.herokuapp.com/image', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(response => {
                if(response){
                    fetch('https://shrouded-plains-66034.herokuapp.com/image', {
                        method: 'put',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user,{entries: count}))
                        })
                        .catch(console.log)
                }
                this.displayFaceBox(this.calculateFaceLocation(response));
            }) 
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if(route === 'signOut') this.setState(initialState);
        else if (route === 'home') this.setState({isSignedIn: true});
        this.setState({route: route});
    }

}

export default App;
