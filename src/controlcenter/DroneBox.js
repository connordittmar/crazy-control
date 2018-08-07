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

  takeoff_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.droneid + '/takeoff',
    serviceType: 'Takeoff'
  })

  land_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.droneid + '/land',
    serviceType: 'Land'
  })

  takeoff_request = new ServiceRequest({
    groupMask: 0,
    height: toFloat(this.props.takeoff_height),
    duration: {
      secs: toFloat(this.props.takeoff_duration),
      nsecs: 0
    },
  })

  land_request = new ServiceRequest({
    groupMask: 0,
    height: 0,
    duration: {
      secs: 2,
      nsecs: 0
    },
  })

  state_client = new Service({
    ros: this.props.ros,
    name: '/' + this.props.droneid +'/takeoff',
    serviceType: 'state'
  })

  state_request = new ServiceRequest({

  })

  toggleSelected () {
    this.setState({selected: !this.state.selected});
  }

  docallarm  ()  {
    this.takeoff_client.callService(this.takeoff_request, (result) => console.log('Takeoff...'));
    this.setState({armchecked: true});
  }

  docalldisarm () {
    this.land_client.callService(this.land_request, (result) => console.log('Landing...'));
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
    const ros = this.props.ros;
    const droneid = this.props.droneid
    if (armsig==true && sel==true && isarmed==false) {
      this.docallarm();
    };
    if (armsig==false && sel==true && isarmed==true) {
      this.docalldisarm();
    }
    return (
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider onChange={() => this.handleslider()} checked={isarmed} />
              </Table.Cell>
              <Table.Cell>{droneid}</Table.Cell>
              <NonVisSubscriber
                ros={ros}
                topic={'/' + droneid + '/battery'}
                type={'std_msgs/Float32'} />
              <NonVisSubscriber
                ros={ros}
                topic={'/' + droneid + '/rssi'}
                type={'std_msgs/Float32'} />
              <NonVisSubscriber
                ros={ros}
                topic={'/' + droneid + '/battery'}
                type={'std_msgs/Float32'} />
              <Table.Cell><Checkbox onChange={() => this.toggleSelected()} checked={isarmed}/></Table.Cell>
            </Table.Row>
    );
  };
}

export default DroneBox
