import React, { Component } from 'react';
import { Actions, Store } from './state/state'
import {debounce} from "lodash"

class App extends Component {
    constructor(props) {
        super(props);
        const weatherInfoReciever = new WeatherInfoReciever();
        this.unsubscribe = Store.subscribe(weatherInfoReciever.getWeatherInfo);
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

    componentWillUnmount() {
        this.unsubscribe();
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
        let style;
        if (this.state.color) {
            style = {
                width: 100,
                height: 100,
                color: this.state.color
            }
        } else {
            style = {
                display: 'none'
            };
        }
        const el = <div style={this.state}></div>;
        console.log(style);
        console.log(el);
        return el;
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

class WeatherInfoReciever {
    constructor() {
        this._oldLocation = Store.getState().location;
    }

    getWeatherInfo = debounce(async () => {        
        const location = Store.getState().location;
        if (location !== this._oldLocation) {
            this._oldLocation = location;
            const info = await this._recieveWeatherInfoForLocation(location);
            Store.dispatch(info);
        }
    }, 400);

    async _recieveWeatherInfoForLocation(location) {
        if (!location) {
            return;
        }
    
        const url = this._getWeatherUrl(location);
        return await (fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`Cannot fetch weather (${response.status})`);
                }

                return response.json();
            })
            .then(ans => {
                if (!ans.success) {
                    throw new Error(ans.error.description);
                }

                return this._getWeatherInfo(ans.response.ob);
            })
            .catch(this._getError));
    }

    _getWeatherUrl(location) {
        return `https://api.aerisapi.com/observations/${location}?&format=json&filter=allstations&limit=1&fields=ob.weather,ob.tempC&client_id=fD3yzDEwR2Jv2fzSn24vu&client_secret=wlcVokVwyBSlMVAMdnHMrwIL1ducoASIXpNQZPj0`;
    }

    _getError(error) {
        return {
            type: Actions.ERROR,
            errorMessage: error.message
        };
    }

    _getWeatherInfo(info) {
        return {
            type: Actions.GET_WEATHER,
            temp: info.tempC,
            weather: info.weather
        }
    }
}

export default App;