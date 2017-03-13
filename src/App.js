import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    data: [
      {
        id: 801,
        name: "Postalm",
        country: "Au",
        temp: "7",
        dt: 1488894600,
        sunrise: 1489213336,
        sunset: 1489255159,
        isOpen: false,
        date: "06 Mar 2017",
        weekDay: "Monday" 
      }
    ]
  };

  render() {
    return (
      <div className="bcg center">
        <WeatherAppBody 
          data={this.state.data}
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
          <LocationToggle data={this.props.data}/>
        </div>
      </div>
    )
  }
}

class LocationToggle extends React.Component {

  state = {
    isOpen: false
  }

  handleLocationOpen = () => {
    this.setState({
      isOpen: true
    });
  }

  handleLocationClose = () => {
    this.setState({
      isOpen: false
    });
  }

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
        country={datum.country}
        temp={datum.temp}
        dt={datum.dt}
        sunrise={datum.sunrise}
        sunset={datum.sunset}
        date={datum.date}
        weekDay={datum.weekDay}
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
    
  const unixTimestampToHuman = function (timestamp) {

    const newDate = new Date();
    newDate.setTime(timestamp * 1000);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();

    return hours + ":" + minutes;

  }
  
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