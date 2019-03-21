import React, { Component } from 'react';
import { Actions, Store } from './state/state'
import {debounce} from "lodash"

class App extends Component {
    constructor(props) {
        super(props);
        const updateWeatherInfo = debounce(async () => {
            
        }, 500);
        this.unsubscribe = Store.subscribe(async () => this.setState(Store.getState()));
    }

    render() {
        return (
            <div className="App">
                <LocationSearch/>
                <WeatherInfo/>
                <TempratureColor/>
            </div>
        );
    }
}

class LocationSearch extends Component {
    constructor(props) {
        super(props);
        this.updateLocation = this.updateLocation.bind(this);
    }

    render() {
        return (
            <input placeholder="Enter your location" onChange={this.updateLocation}></input>
        )
    }

    updateLocation(event) {
        Store.dispatch({
            type: Actions.INPUT_LOCATION,
            location: event.target.value
        })
    }
}

class WeatherInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.unsubscribe = Store.subscribe(() => this.setState(Store.getState()));
    }

    render() {
        return (
            <div>
                {this.state.errorMessage &&
                    <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
                }
                {this.state.lastSuccessLocation &&
                    (
                        <div>
                            <p>{this.state.lastSuccessLocation}</p>
                            <p>Temprature: {this.state.temp}</p>
                            <p>Weather: {this.state.weather}</p>
                        </div>
                    )
                }
            </div>
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

class TempratureColor extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.unsubscribe = Store.subscribe(() => {
            const temp = Store.getState().temp;
            this.setState({
                color: (!temp) ? undefined
                        : (temp > 0) ? "red"
                        : "blue"
            })
        });
    }

    render() {
        const style = {
            width: 100,
            height: 100
        };
        if (this.state.color) {
            style.color = this.state.color;
        } else {
            style.display = "none";
        }
        return (<div style={this.state}></div>);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

async function recieveWeatherInfo(location) {
    if (location) {
        return;
    }
    try {
        const url = `https://api.aerisapi.com/observations/${location}?&format=json&filter=allstations&limit=1&fields=ob.weather,ob.tempC&client_id=fD3yzDEwR2Jv2fzSn24vu&client_secret=wlcVokVwyBSlMVAMdnHMrwIL1ducoASIXpNQZPj0`;
        await fetch(url)
            .then(response => {
                if (response.status != 200) {
                    throw `Cannot fetch weather (${response.status})`;
                }
                return response.json();
            })
            .then(ans => {
                if (!ans.success) {
                    throw ans.error.description;
                }
                
                return {
                    location: location,
                    errorMessage: undefined,
                    temp: ans.response.ob.tempC,
                    weather: ans.response.ob.weather,
                    lastSuccessLocation: location
                };
            })
            .catch(error => { return {errorMessage: error} });
    } catch (e) {
        return {errorMessage: e};
    }
}

export default App;