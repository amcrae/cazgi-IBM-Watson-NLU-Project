import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      // There is no map() function on Javascript Map objects, only on lists.
      // It makes more sense to render by iterating through the Map keys,
      // however we were asked to use the map() function to render.
      // So I have decided to transform the data into a nested list format
      // which can be rendered easier by a map() producing JSX elements.
      let toRender = [];
      for (let k in this.props.emotions) {
          toRender.push( [ k, this.props.emotions[k] ] );
      }
      return (  
        <div>
          <table className="table table-bordered emotions">
            <thead><th>Emotion</th><th>Confidence Level</th></thead>
            <tbody>
                { 
                    toRender.map(
                        (li) => <tr> <td>{li[0]}</td><td>{li[1]}</td> </tr>
                    )
                }
            </tbody>
          </table>
          </div>
          );
    }
    
}
export default EmotionTable;
