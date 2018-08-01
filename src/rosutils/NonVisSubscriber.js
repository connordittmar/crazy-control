import React, {Component} from 'react'
import { Ros, Topic, Message } from 'roslib'
import {Table} from 'semantic-ui-react'
type Props = {
  onRequestClose?: () => void,
  ros: Ros,
  topic: string,
  type: string,
}

type State = {
  autoscroll: boolean,
  index: number,
  message: Message,
  messageCount: number,
}

class NonVisSubscriber extends Component<Props,State> {
  subscriber = new Topic({
    ros: this.props.ros,
    name: this.props.topic,
    messageType: this.props.type,
  })

  state = {
    message: {},
  }

  componentDidMount = () => {
    this.subscribe();
  }
  componentWillUnmount = () => {
    this.subscriber.unsubscribe();
  }

  subscribe = () => {
    this.subscriber.subscribe((message: Message) => {
      this.setState(prevState => ({
        message: message,
      }));
    });
  }
  render () {
    return (
      <Table.Cell>{this.state.message.data}</Table.Cell>
    );
  };
}
export default NonVisSubscriber
