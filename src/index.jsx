/** @jsx createElement */
import _ from 'lodash'
import {createElement, Source, Phrase} from 'lacona-phrase'
import String from 'lacona-phrase-string'

class SubscriptionSource extends Source {
  onCreate () {
    if (process && process.env && process.env.LACONA_ENV === 'demo') {
      this.replaceData(global.config[this.props.key])
    } else {
      const {subscriptionId, value} = global.subscribeToChanges(this.constructor.eventName, this.change.bind(this))

      this.replaceData(value[this.props.key])

      this.subscriptionId = subscriptionId
    }
  }

  onDelete () {
    if (process && process.env && process.env.LACONA_ENV === 'demo') {

    } else {
      global.removeChangeSubscription(this.constructor.eventName, this.subscriptionId)
    }
  }

  change (newValues) {
    if (!_.isEqual(newValues[this.props.key], this.data)) {
      this.replaceData(newValues[this.props.key])
    }
  }
}

export class Config extends SubscriptionSource {}
Config.eventName = 'config'

export class Context extends SubscriptionSource {}
Context.eventName = 'context'

export class TextSelection extends Phrase {
  source () {
    return {
      selection: <Context key='selection' />,
      clipboard: <Context key='clipboard' />
    }
  }


  describe () {
    return (
      <argument text={this.props.argument || 'string'}>
        <choice>
          {this.sources.selection.data ?
            <literal text='this selection' value={this.sources.selection.data} truncate={true} category='symbol' />
          : null }
          {this.sources.clipboard.data ?
            <literal text='my clipboard' value={this.sources.clipboard.data} truncate={true} category='symbol' />
          : null }
        </choice>
      </argument>
    )
  }
}

TextSelection.extends = [String]

export default  {
  extensions: [TextSelection]
}
