import React, {Component} from 'react'
import { Ros, Topic, Message } from 'roslib'

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
    autoscroll: true,
    index: -1,
    message: {},
    messageCount: 0,
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
        messageCount: prevState.messageCount += 1,
      }));
    });
  }
  render () {
    return (
      <div>
      <p>{this.state.message}</p>
      </div>
    )
  }
}
export default NonVisSubscriber
