import React from 'react';
import './App.css';
import 'whatwg-fetch';

class App extends React.Component {

  state = {
    data: [
      {
        base: "stations",
        clouds: {
          all: 8
        },
        cod: 200,
        coord: {
          lat: 51.51,
          lon: -0.13
        },
        dt: 1489416600,
        id: 2643743,
        main: {
          humidity: 44,
          pressure: 1029,
          temp: 15,
          temp_max: 16,
          temp_min: 7
        },
        name: "London",
        sys: {
          country: "GB",
          id: 5091,
          message: 1.7248,
          sunrise: 1489385848,
          sunset: 1489428179,
          type: 1
        },
        visibility: 1000,
        weather: [
          0: {
            description: "clear sky",
            icon: "02d",
            id: 800,
            main: "Clear"
          }
        ],
        wind: {
          deg: 280,
          speed: 4.1
        }
        // id: 801,
        // name: "Postalm",
        // country: "Au",
        // temp: "7",
        // dt: 1488894600,
        // sunrise: 1489213336,
        // sunset: 1489255159,
        // isOpen: false,
        // date: "06 Mar 2017",
        // weekDay: "Monday" 
      }
    ],
    positionData: {}
  };

  componentWillMount() {
    this.loadPositionDataFromIP;
    this.fetchPosData = setInterval(this.loadPositionDataFromIP, 1);
  }

  componentWillUnmount() {
    clearInterval(this.fetchPosData);
  }

  // loadPositionDataFromIP = () => {
  //   return fetch('http://freegeoip.net/json/')
  //   .then(res => {
  //     res.json().then(json => {
  //       const pos = {
  //         lat: json.latitude,
  //         lon: json.longitude
  //       };
  //       this.setState({
  //         positionData: pos
  //       });
  //     });
  //   });
  // }

  render() {

    return (
      <div className="bcg center">
        <WeatherAppBody 
          data={this.state.data}
          positionData={this.state.positionData}
        />
      </div>
    );
  }
}

class WeatherAppBody extends React.Component {

  // componentDidUpdate() {
  //   let lat = this.props.positionData.lat,
  //       lon = this.props.positionData.lon;
  //   const API_KEY = "&appid=f82dadc574f85cab41e3e12f10295cdc",
  //         API_URL = "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + lat + "&" + "lon=" + lon + API_KEY;
  //   fetch(API_URL).then(res => {
  //     res.json().then(json => {
  //       this.setState({
  //         data: this.state.data.concat(d)
  //       }.bind(this));
  //     });
  //   });
  // }

  render() {
    return (
      <div className="container center">
        <div className="col__12 dashboard"> 
          <LocationToggle data={this.props.data}/>
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
     return (
        <LocationsInfo 
          data={this.props.data}
          onCloseClick={this.handleLocationClose}
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

    // function getDate() {
    //   const newDate = Date.now();
    //   console.log(newDate);
    // }

    // getDate();

    return (
      <div className="row">
        <div className="col__6">
          <h2>{this.props.name} {this.props.country}</h2>
          <p className="week-day">{this.props.weekDay} {this.props.date}</p>
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