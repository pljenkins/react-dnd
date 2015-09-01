import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import BoxTarget from './BoxTarget';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

const style = {
  width: 600
};

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveCardToBox = this.moveCardToBox.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library'
      }, {
        id: 2,
        text: 'Make it generic enough'
      }, {
        id: 3,
        text: 'Write README'
      }, {
        id: 4,
        text: 'Create some examples'
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it'
      }, {
        id: 6,
        text: '???'
      }, {
        id: 7,
        text: 'PROFIT'
      }],
      cardsInBox: []
    };
  }

  moveCard(id, afterId) {
    const { cards } = this.state;

    const card = cards.filter(c => c.id === id)[0];
    const afterCard = cards.filter(c => c.id === afterId)[0];
    const cardIndex = cards.indexOf(card);
    const afterIndex = cards.indexOf(afterCard);

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card]
        ]
      }
    }));
  }

  moveCardToBox(id) {
    this.setState(update(this.state, {
      cardsInBox: { $push: [id] }
    }));
  }

  render() {
    const { cards } = this.state;
    const boxCards = cards.filter(card => this.state.cardsInBox.indexOf(card.id) !== -1).map(card => {
      return (card.text)
    })

    return (
      <div style={style}>
        <div style={{ float: 'left' }}>
          {cards.filter(card => this.state.cardsInBox.indexOf(card.id) === -1).map(card => {
            return (
              <Card key={card.id}
                    id={card.id}
                    text={card.text}
                    moveCard={this.moveCard} />
            );
          })}
        </div>
        <div style={{ float: 'right'}}>
          <BoxTarget  items={boxCards}
                      moveCardToBox={this.moveCardToBox}/>
        </div>
      </div>
    );
  }
}
