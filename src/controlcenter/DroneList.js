import React, {Component} from 'react'
import {Button, Container} from 'semantic-ui-react'
import { Ros, Topic} from 'roslib'
import TopMenu from '../bin/TopMenu'
import Subscriber from '../rosutils/Subscriber'
class SettingsPanel extends Component {

  ros = new Ros({url:'ws://192.168.1.40:8080'})

  render () {
    return (
      <div>
        <TopMenu/>
        <Container style={{marginTop:'3em'}}>
        <Subscriber
          ros={this.ros}
          topic='/mavros/global_position/rel_alt'
          type='std_msgs/Float64' />
          <Subscriber
            ros={this.ros}
            topic='/mavros/global_position/rel_alt'
            type='std_msgs/Float64' />
            <Subscriber
              ros={this.ros}
              topic='/mavros/global_position/rel_alt'
              type='std_msgs/Float64' />
              <Subscriber
                ros={this.ros}
                topic='/mavros/global_position/rel_alt'
                type='std_msgs/Float64' />
        </Container>
      </div>
    )
  };
}

export default SettingsPanel
