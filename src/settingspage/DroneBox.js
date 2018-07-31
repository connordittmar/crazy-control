import React, {Component} from 'react'
import NonVisSubscriber from '../rosutils/NonVisSubscriber'
import {Service, ServiceRequest, Ros, Topic} from 'roslib'
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

  arm_request = new ServiceRequest({
    arm: 1,
  })
  disarm_request = new ServiceRequest({
    arm: 0,
  })

  state_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.droneid +'/state',
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
              <NonVisSubscriber
                ros={this.props.ros}
                topic={'/' + this.props.droneid + '/battery'}
                type='std_msgs/Float32' />
              <Table.Cell><Checkbox onChange={() => this.toggleSelected()} checked={this.state.selected}/></Table.Cell>
            </Table.Row>
    );
  };
}

export default DroneBox
