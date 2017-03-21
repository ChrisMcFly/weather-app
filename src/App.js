import React from 'react';
import './App.css';
import 'whatwg-fetch';
import moment from 'moment';

class App extends React.Component {

  state = {
    data: [],
    positionData: {}
  };

  componentDidMount() {
    this.getPositionData();
  }

  getPositionData = () => {
    fetch('http://freegeoip.net/json/')
      .then(res => {
        res.json().then(json => {
          const pos = {
            lat: json.latitude,
            lon: json.longitude
          };
          this.setState({
            positionData: pos
          });
        });
    });
  };

  handleWeatherData = () => {
    let lat = this.state.positionData.lat,
        lon = this.state.positionData.lon;
    const API_KEY = 'f82dadc574f85cab41e3e12f10295cdc',
          API_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    if(this.state.data.length === 0){
      return fetch(API_URL).then(res => {
        res.json().then(json => {
          this.setState({
            data: this.state.data.concat(json)
          });
        });
      });
    }
    return false;
  };

 handleDate = () => {
    return moment().format('dddd D MMM YYYY');
  };

  render() {
    return (
      <div className="bcg center">
        <WeatherAppBody 
          data={this.state.data}
          positionData={this.state.positionData}
          getWeatherData={this.handleWeatherData}
          getDate={this.handleDate}
        />
      </div>
    );
  }
}

class WeatherAppBody extends React.Component {
  render() {
    return (
      <div className="container center">
        <div className="col__12 dashboard"> 
          <LocationToggle 
            data={this.props.data}
            positionData={this.props.positionData}
            getWeatherData={this.props.getWeatherData}
            getDate={this.props.getDate}
          />
        </div>
      </div>
    )
  }
}

class LocationToggle extends React.Component {

  state = {
    isOpen: false
  };

  handleLocationOpen = () => {
    this.setState({
      isOpen: true
    });
  };

  handleLocationClose = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    if(this.state.isOpen){
     this.props.getWeatherData();
     return (
        <LocationsInfo 
          data={this.props.data}
          onCloseClick={this.handleLocationClose}
          getDate={this.props.getDate}
        />
      );
    } else {
     return ( 
      <GetLocation 
        onOpenClick={this.handleLocationOpen}
      />
      );
    }
  }

}

class LocationsInfo extends React.Component {
  render() {
    const data = this.props.data.map((datum) => (
      <LocationInfo 
        id={datum.id}
        key={datum.id}
        name={datum.name}
        country={datum.sys.country}
        temp={datum.main.temp}
        dt={datum.dt}
        sunrise={datum.sys.sunrise}
        sunset={datum.sys.sunset}
        weather={datum.weather}
        description={datum.weather.description}
        icon={datum.weather.icon}
        date={datum.date}
        onCloseClick={this.props.onCloseClick}
        getDate={this.props.getDate}
      />
    ));
    return (
      <div>
        {data}
      </div>
    )
  }
}

class LocationInfo extends React.Component {
  render() {
    
    const unixTimestampToHuman = timestamp => {

      const newDate = new Date();
      newDate.setTime(timestamp * 1000);
      const hours = newDate.getHours();
      const minutes = newDate.getMinutes();

      const humanized = [
        pad(hours.toString(), 2),
        pad(minutes.toString(), 2)
      ].join(":");

      return humanized;

    };

    function pad(numberString, size) {
      let padded = numberString;
      while (padded.length < size) padded = `0${padded}`;
      return padded;
    }

    const weatherData = (elem) => {
      if(elem.length >= 1){
        let elemArr = [];
        elemArr.push(elem[0]);
        return elemArr;
      } 
      return elem;
    };

    return (
      <div>
        <div className="row">
          <span className="close pull-right" onClick={this.props.onCloseClick}></span>
          <div className="col__6">
            <h2>{this.props.name} {this.props.country}</h2>
            <p className="week-day">{this.props.getDate()}</p>
          </div>
          <div className="col__6">
            <div className="row">
              <p className="col__6 sun-rise">Sunrise {unixTimestampToHuman(this.props.sunrise)}</p>
              <p className="col__6 sun-set">Sunset {unixTimestampToHuman(this.props.sunset)}</p>
            </div>
          </div>
          <WeatherConditions
              weather={weatherData(this.props.weather)}
              temp={this.props.temp}
          />
        </div>
      </div>
    )
  }

}

class WeatherConditions extends React.Component {
  render(){
    console.log(this.props.weather)
    const weather = this.props.weather.map((datum) => (
      <WeatherInfo 
        id={datum.id}
        key={datum.id}
        description={datum.description}
        icon={datum.icon}
        main={datum.main}
        temp={this.props.temp}
      />
    ));
    return (
      <div>
        {weather}
      </div>
    );
  }
}

class WeatherInfo extends React.Component {
  render(){

    function roundNumber(data){
      return Math.floor(data);
    }

    return(
      <div className="row text-center">
        <div className="col__12"><h2>{this.props.main}</h2></div>
        <div className="col__12">
          <IconHandler id={this.props.id}/>
        </div>
        <div className="col__12">
          <p>{this.props.description}</p>
        </div>
        <div className="col__12">
          <p className="temp">Temperature: <i>{roundNumber(this.props.temp)}</i><span>&#8451;</span></p>
        </div>
      </div>
    );
  }
}

class IconHandler extends React.Component {
  render(){
    const setIcon = conditionId => {
      if (conditionId >= 200 && conditionId <= 232) {
        return (
          <div className="icon thunder-storm">
            <div className="cloud"></div>
            <div className="lightning">
              <div className="bolt"></div>
              <div className="bolt"></div>
            </div>
          </div>
        );
      } else if (conditionId >= 300 && conditionId <= 321) {
        return (
          <div className="icon rainy">
            <div className="cloud"></div>
            <div className="rain"></div>
          </div>
        );
      } else if (conditionId >= 500 && conditionId <= 531) {
        return (
          <div className="icon sun-shower">
            <div className="cloud"></div>
            <div className="sun">
              <div className="rays"></div>
            </div>
            <div className="rain"></div>
          </div>
        );
      } else if (conditionId >= 600 && conditionId <= 622) {
        return (
          <div className="icon flurries">
            <div className="cloud"></div>
            <div className="snow">
              <div className="flake"></div>
              <div className="flake"></div>
            </div>
          </div>
        );
      } else if (conditionId === 800) {
        return (
          <div className="icon sunny">
            <div className="sun">
              <div className="rays"></div>
            </div>
          </div>
        );
      } else if (conditionId === 801) {
        return (
          <div className="icon sun-cloudy">
            <div className="cloud"></div>
            <div className="sun">
              <div className="rays"></div>
            </div>
          </div>
        );
      } else if (conditionId >= 802 && conditionId <= 804) {
        return (
          <div className="icon cloudy">
            <div className="cloud"></div>
            <div className="cloud"></div>
          </div>
        );
      } 
    }
    return (
      <div>
        {setIcon(this.props.id)}
      </div>
    );
  }
}

class GetLocation extends React.Component {
  render() {
    return (
      <div>
        <h1 className="text-center">Weather Application</h1>
        <LocationButton onClick={this.props.onOpenClick}/>
      </div>
    );
  }
}

class LocationButton extends React.Component {

  render() {
    return (
      <div  className="text-center">
        <button className="btn location" onClick={this.props.onClick}>
          <span>Find Your Location</span>
        </button>
      </div>
    );
  }
}

export default App;