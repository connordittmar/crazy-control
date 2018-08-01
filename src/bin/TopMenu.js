import React, {Component} from 'react'
import { Container, Menu, Radio, Icon} from 'semantic-ui-react'

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.handleURI = this.handleURI.bind(this);
    this.state = {uri: '' };
  }
  handleURI(e) {
    this.setState({usi: e.target.value})
  }

  render() {
    const uri = this.state.uri
    return (
      <div>
        <Menu fixed='top' inverted>
          <Container>
            <Menu.Item name='telemetry' />
            <Menu.Item name='imaging'/>
            <Menu.Item name='network'/>
            <Menu.Menu position='right'>
              <Menu.Item><Input
                label='ROS MASTER:'
                icon='exchange'
                placeholder='ws://10.1.1.200:8080'
                value={uri}
                onChange={this.handleURI}
                />
              </Menu.Item>
              <Menu.Item icon='cog'/>
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
    )
  };
}
export default TopMenu
