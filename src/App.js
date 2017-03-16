import React from 'react';
import './App.css';
import 'whatwg-fetch';

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
          API_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
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

 handleDate = (timestamp) => {
    const newDate = new Date(timestamp);
    let dateArr = [];
    dateArr.push(newDate.toString().split(' '));
    console.log(dateArr);
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
        date={datum.date}
        weekDay={Date.now()}
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

    return (
      <div className="row">
        <div className="col__6">
          <h2>{this.props.name} {this.props.country}</h2>
          <p className="week-day">{this.props.getDate(this.props.weekDay)}</p>
        </div>
        <div className="col__6">
          <span className="close pull-right" onClick={this.props.onCloseClick}></span>
          <div className="row">
            <p className="col__6 sun-rise">Sunrise {unixTimestampToHuman(this.props.sunrise)}</p>
            <p className="col__6 sun-set">Sunset {unixTimestampToHuman(this.props.sunset)}</p>
          </div>
        </div>
      </div>
    )
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