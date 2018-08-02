import React, {Component} from 'react'
import {Button, Container, Table, Menu, Input, Message} from 'semantic-ui-react'
import {Ros, Service, ServiceRequest} from 'roslib'
import {Drone} from '../bin/drone'
import DroneBox from './DroneBox'
import Subscriber from '../rosutils/Subscriber'


class App extends Component {
  constructor(props) {
    super(props);
    this.updateTakeoffHeight = this.updateTakeoffHeight.bind(this);
    this.updateTakeoffDuration = this.updateTakeoffDuration.bind(this);
    this.state = {
      armsignal: false,
      drone_ids: [],
    };
  }

  ros = this.props.ros;

  populateTable (topics) {
    //topics is an array of strings with all ros topics
    var drone_strings = [];
    var count = topics.length;
    topics.sort();
    //find all drone-related topics
    for (var i = 0; i < count; i++) {
      var str = topics[i];
      var key = str.slice(1,5);
      if (key == 'craz') {
        drone_strings.push(str)
      }
    }
    var drone_ids = [];
    var count = drone_strings.length;
    var old_key = '';
    //return only unique numbers
    for (var i = 0; i < count; i++) {
      var str = drone_strings[i];
      var key = str.split('/')[1].replace('crazyflie','');
      if (key != old_key) {
        drone_ids.push(parseInt(key,10));
      }
      old_key = key;
    };
    this.setState({drone_ids: drone_ids});
  }

  updateTakeoffHeight (e) {
    this.setState({takeoff_height: e.target.value })
  }

  updateTakeoffDuration (e) {
    this.setState({takeoff_duration: e.target.value})
  }

  handleArmClick () {
    this.setState({armsignal: true});
  }

  handleDisarmClick () {
    this.setState({armsignal: false});
  }

  GenDrones (ids) {
    const armsignal = this.state.armsignal;
    const takeoff_height = this.state.takeoff_height;
    const takeoff_duration = this.state.takeoff_duration;
    const listItems = ids.map((id) =>
      <DroneBox
        key={id}
        ros={this.ros}
        droneid={'crazyflie'+id}
        armsignal={armsignal}
        takeoff_height={takeoff_height}
        takeoff_duration={takeoff_duration}  />
    );
    return (listItems);
  }

  render () {
    //var topicsClient = new Service({
    //  ros: this.ros,
    //  name: '/rosapi/topics',
    //  serviceType: 'rosapi/Topics'
    //});
    //var request = new ServiceRequest();
    //topicsClient.callService(request, (result)=>this.populateTable(result.topics));
    const takeoff_height = this.state.takeoff_height;
    const takeoff_duration = this.state.takeoff_duration;
    const armsignal = this.state.armsignal;
    const content = this.state.content;
    const droneids = ['1','2','3','4','5','6','7','8','9','10'];
    const drone_component_list = this.GenDrones(droneids);

    return (
      <div>
      <Table compact celled selectable definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Takeoff/Land</Table.HeaderCell>
            <Table.HeaderCell>Drone #</Table.HeaderCell>
            <Table.HeaderCell>Battery</Table.HeaderCell>
            <Table.HeaderCell>Rssi</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Select</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {drone_component_list}
        <Table.Row>
          <Table.Cell><Input placeholder="Takeoff Height" onChange={() => this.updateTakeoffHeight()}/></Table.Cell>
          <Table.Cell><Input placeholder="Takeoff Duration" onChange={() => this.updateTakeoffDuration()}/></Table.Cell>
          <Table.Cell/>
          <Table.Cell><Button content="Takeoff Selected" onClick={() => this.handleArmClick()}/></Table.Cell>
          <Table.Cell><Button content="Land Selected" onClick={() => this.handleDisarmClick()}/></Table.Cell>
        </Table.Row>
        </Table.Body>
      </Table>
      <div>
      <Subscriber
        ros={this.ros}
        topic='/crazyflie14/battery'
        type='std_msgs/Float32'
      />
      </div>
      </div>

    )

  };
}

export default App
