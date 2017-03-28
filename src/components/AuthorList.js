import React, { Component } from 'react';
import Author from './Author';

class AuthorList extends Component {
 render() {
   let authorNodes = this.props.data.map(author => {
     return (
      <Author name={ author.name } 
        uniqueID={ author['_id'] }
        onAuthorDelete={ this.props.onAuthorDelete }
        onAuthorUpdate={ this.props.onAuthorUpdate }
        key={ (author['_id']) ? author['_id'] : 'holder' } 
        text={ author.text } />
     )
   })
   return (
     <div>
       { authorNodes }
     </div>
   );
 }
}

export default AuthorList;
