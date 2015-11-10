/** @jsx createElement */
import {createElement, Source} from 'lacona-phrase'

export default class ConfigSource extends Source {
  onCreate () {
    const values = global.getConfigValues()
    this.replaceData(values)
    
    global.subscribeToConfigChanges(this.replaceData.bind(this))
  }
}
