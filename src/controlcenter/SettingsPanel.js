import React, {Component} from 'react'
import {Button, Container, Table, Menu, Input, Message} from 'semantic-ui-react'
import {Ros, Service, ServiceRequest} from 'roslib'
import {Drone} from '../bin/drone'
import DroneBox from './DroneBox'
import Subscriber from '../rosutils/Subscriber'


class SettingsPanel extends Component {
  constructor(props) {
    super(props);
    this.handleURL = this.handleURL.bind(this);
    this.state = {
      armsignal: false,
      connected: false,
      error: undefined,
      drone_ids: [],
      url: 'ws://localhost:8080',
    };
  }

  ros = null

  handleConnect = () => {
    try {
      this.ros = new Ros({
        url: this.state.url,
      });

      if (this.ros) this.ros.on('connection',()=>{
        this.setState({
          connected: true,
        });
      });

      if (this.ros) this.ros.on('error', (error) => {
        this.setState({
          error: (
            <div>
              <Message error header='Connection Error:'>
                <p>Unable to connect to ROS on {this.state.url}</p>
              </Message>
            </div>
          ),
        });
      });
    } catch (e) {
      this.setState({
        error: (
          <div>
            <Message error header='Error:'>
              <p>{e.message}</p>
            </Message>
          </div>
        ),
      });
    }
  }

  handleURL(e) {
    this.setState({url: e.target.value})
  }

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
    drone_strings.sort();
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
    drone_ids.sort();
    this.setState({drone_ids: drone_ids});
  }

  renderDroneBox (i,armsignal) {
    return <DroneBox ros={this.ros} droneid={'crazyflie'+i} armsignal={armsignal}/>
  }

  handleArmClick () {
    this.setState({armsignal: true});
  }

  handleDisarmClick () {
    this.setState({armsignal: false});
  }

  render () {
    var view = '';
    if (this.state.connected) {
      var topicsClient = new Service({
        ros: this.ros,
        name: '/rosapi/topics',
        serviceType: 'rosapi/Topics'
      });
      var request = new ServiceRequest();
      topicsClient.callService(request, (result)=>this.populateTable(result.topics));
      const armsignal = this.state.armsignal;
      const content = this.state.content;
      var drone_component_list = [];
      var num_drones = this.state.drone_ids.length;
      for (var i = 0; i < num_drones; i++) {
        var id = this.state.drone_ids[i];
        drone_component_list.push(
          <DroneBox ros={this.ros} droneid={'crazyflie'+id} armsignal={armsignal}/>
        )
      }
      view = (
        <div>
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item name='placeholder' />
              <Menu.Item name='placeholder'/>
              <Menu.Item name='placeholder'/>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input
                    label='ROS MASTER:'
                    value={this.state.url}
                    onChange={this.handleURL}
                  />
                  <Button onClick={this.handleConnect}>Connect</Button>
                </Menu.Item>
                <Menu.Item icon='cog'/>
              </Menu.Menu>
            </Container>
          </Menu>
        <Container style={{marginTop:'4em'}}>
        <Table compact celled selectable definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Armed?</Table.HeaderCell>
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
            <Table.Cell/>
            <Table.Cell/>
            <Table.Cell/>
            <Table.Cell><Button content="Arm Selected" onClick={() => this.handleArmClick()}/></Table.Cell>
            <Table.Cell><Button content="Disarm Selected" onClick={() => this.handleDisarmClick()}/></Table.Cell>
          </Table.Row>
          </Table.Body>
        </Table>
        </Container>
        <Subscriber
          ros={this.ros}
          topic='/mavros/global_position/rel_alt'
          type='std_msgs/Float64' />
        </div>
      );
    } else {
      view = (
        <div>
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input
                    label='ROS MASTER:'
                    value={this.state.url}
                    onChange={this.handleURL}
                  />
                  <Button onClick={this.handleConnect}>Connect</Button>
                </Menu.Item>
                <Menu.Item icon='cog'/>
              </Menu.Menu>
            </Container>
          </Menu>
          <Container style={{marginTop:'5em'}}>
            {this.state.error}
          </Container>
        </div>
      );
    }

    return view;
  };
}

export default SettingsPanel
