import React from 'react'
import ReactDOM from 'react-dom'
import PageManager from '../theme/page-manager'
import Collection from './Components/Collection'
import graphqlOptipns from './graphql-options'


export default class BoldBox extends PageManager {
    async onReady() {

        const container = document.getElementById("bold-box-kit")
            ReactDOM.render(
        React.createElement(<Collection feed={this.context}/>,
            container))
        }
}