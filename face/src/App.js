import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './Navigation/Navigation';
import ParticleEffect from './Particles/Particles';
import Logo from './Logo/Logo';
import Rank from './Rank/Rank';
import SignIn from './SignIn/SignIn';
import Register from './Register/Register';
import ImageLinkForm from './ImageLinkForm/ImageLinkForm';
import FaceRecognition from './FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey:'d12aeeae2b664b30bf579afe505cab34'
});

class App extends Component {

    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signIn',
            isSignedIn: false
        }
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
        console.log(box);
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
  }

    onButtonSubmit = () => {
        console.log('submit');
        this.setState({ box:{} });
        this.setState({ imageUrl: this.state.input });
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then( response => this.displayFaceBox(this.calculateFaceLocation(response))) 
            .catch( err => console.log(err));
    }

    onRouteChange = (route) => {
        if(route === 'signOut') this.setState({isSignedIn: false});
        else if (route === 'home') this.setState({isSignedIn: true});
        this.setState({route: route});
    }

    render() {
        const { isSignedIn, route, imageUrl, box }  = this.state;
        return (
          <div className="App">
            <ParticleEffect />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/> 
            { route === 'home'
                ? <div>
                    <Logo />
                    <Rank />
                    <ImageLinkForm onInputChange={this.onInputChange} 
                        onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box} imageUrl={imageUrl}/>
                  </div>
              : (
                route === 'signIn'
                  ? <SignIn onRouteChange={this.onRouteChange}/>
                  : <Register onRouteChange={this.onRouteChange}/>
              )
            }
          </div>
        );
    }
}

export default App;
