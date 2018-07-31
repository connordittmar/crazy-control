import React, {Component} from 'react'
import {Button, Container, Table} from 'semantic-ui-react'
import {Ros} from 'roslib'
import {Drone} from '../bin/drone'
import DroneBox from './DroneBox'


class SettingsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      armsignal: false,
    };
  }
  ros = new Ros({url:'ws://192.168.1.40:8080'})

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
    const armsignal = this.state.armsignal;
    const content = this.state.content;
    return (
      <div>
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
        {this.renderDroneBox(1,armsignal)}
        {this.renderDroneBox(2,armsignal)}
        {this.renderDroneBox(3,armsignal)}
        {this.renderDroneBox(4,armsignal)}
        {this.renderDroneBox(5,armsignal)}
        <Table.Row>
          <Table.Cell/>
          <Table.Cell/>
          <Table.Cell/>
          <Table.Cell><Button content="Arm Selected" onClick={() => this.handleArmClick()}/></Table.Cell>
          <Table.Cell><Button content="Disarm Selected" onClick={() => this.handleDisarmClick()}/></Table.Cell>
        </Table.Row>
        </Table.Body>
      </Table>
      </div>
    )
  };
}

export default SettingsPanel
