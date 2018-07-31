import React, {Component} from 'react'
import NonVisSubscriber from '../rosutils/NonVisSubscriber'
import {Service, ServiceRequest, Ros} from 'roslib'
import {Table, Checkbox} from 'semantic-ui-react'


type Props = {
  ros: Ros,
  droneid: string,
  makeSelected: boolean,
}

class DroneBox extends Component<Props,State> {
  constructor(props) {
    super(props);
    this.state = {
      armchecked: false,
      selected: false,
    }
  }

  arm_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.droneid + '/arm',
    serviceType: '/uav_control/arm'
  })

  subscriber_status = new NonVisSubscriber({
    ros: this.props.ros,
    name: '/' + this.props.droneid + '/status',
    messageType: '/uav_control/uav_status'
  })

  subscriber_rssi = new NonVisSubscriber({
    ros: this.props.ros,
    name: '/' + this.props.droneid + '/rssi',
    messageType: '/std_msgs/Float32'
  })

  arm_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.droneid + '/arm',
    serviceType: '/uav_control/arm'
  })

  arm_request = new ServiceRequest({
    arm: 1,
  })
  disarm_request = new ServiceRequest({
    arm: 0,
  })

  state_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.state +'/state',
    serviceType: '/uav_control/state'
  })

  state_request = new ServiceRequest({

  })

  toggleSelected () {
    this.setState({selected: !this.state.selected});
  }

  docallarm  ()  {
    this.arm_client.callService(this.arm_request, (result) => console.log('Arming...'));
    this.setState({armchecked: true});
  }

  docalldisarm () {
    this.arm_client.callService(this.disarm_request, (result) => console.log('Disarming...'));
    this.setState({armchecked: false});
  }

  handleslider () {
    if (this.state.armchecked==true) {
      this.docalldisarm();
    }
    else {
      this.docallarm();
    }
  }

  componentDidMount (){

  }
  componentWillUnmount () {

  }

  render () {
    const armsig = this.props.armsignal;
    const sel = this.state.selected;
    const isarmed = this.state.armchecked;
    if (armsig==true && sel==true && isarmed==false) {
      this.docallarm();
    };
    if (armsig==false && sel==true && isarmed==true) {
      this.docalldisarm();
    }
    return (
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider onChange={() => this.handleslider()} checked={this.state.armchecked} />
              </Table.Cell>
              <Table.Cell>{this.props.droneid}</Table.Cell>
              <Table.Cell>
              </Table.Cell>
              <Table.Cell>{this.subscriber_rssi.state.message}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell><Checkbox onChange={() => this.toggleSelected()} checked={this.state.selected}/></Table.Cell>
            </Table.Row>
    );
  };
}

export default DroneBox
