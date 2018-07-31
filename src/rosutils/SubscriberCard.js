import React, {Component} from 'react'
import {Card} from 'semantic-ui-react'

type Message = {}

type Props = {
  name: string,
  onRequestClose?: () => void,
  message: Message,
  state?: string
}
type State = {
  minimized: boolean,
}

class SubscriberCard extends Component<Props,State> {
  state = {
    minimized: false
  }

  formatName = (name: string) => {
    const maxlen = 25
    if (name.length > maxlen) return '...' + name.slice(name.length-maxlen, name.length)
    return name
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default SubscriberCard
