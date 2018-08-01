import React, {Component} from 'react'
import {Button, Container, Table, Menu, Input, Message} from 'semantic-ui-react'
import {Ros, Service, ServiceRequest} from 'roslib'
import DroneBox from './DroneBox'
import App from './App'

class TopApp extends Component {
  constructor(props) {
    super(props);
    this.handleURL = this.handleURL.bind(this);
    this.state = {
      connected: false,
      error: undefined,
      url: 'ws://10.1.1.200:8080',
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

  render () {
    var view = '';
    if (this.state.connected) {
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
                  icon='exchange'
                />
                <Button onClick={this.handleConnect}>Connected</Button>
              </Menu.Item>
              <Menu.Item icon='cog'/>
            </Menu.Menu>
          </Container>
        </Menu>
        <Container style={{marginTop:'4em'}}>
        <App
          ros={this.ros}
        />
        </Container>
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

export default TopApp
