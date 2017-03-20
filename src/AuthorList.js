import React, { Component } from 'react';
import Author from './Author';

class AuthorList extends Component {
 render() {
   let authorNodes = this.props.data.map(author => {
     return (
      <Author name={ author.name } key={ author.id } text={ author.text } />
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
