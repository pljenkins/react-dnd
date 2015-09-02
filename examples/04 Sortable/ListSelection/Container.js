import React, { Component } from 'react';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import update from 'react/lib/update';
import Card from './Card';
import BoxTarget from './BoxTarget';
import _ from 'lodash'

const style = {
  width: 750
};
// TODO-NK: have the option of doing fancy styling somewhere based on whether
// user is still dragging or not here, but this is good enough for now

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveRecentCardsBackFromBox = this.moveRecentCardsBackFromBox.bind(this);
    this.moveSelectedCardsToBox = this.moveSelectedCardsToBox.bind(this);
    this.completeBoxMove = this.completeBoxMove.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library',
        selected: false
      }, {
        id: 2,
        text: 'Make it generic enough',
        selected: false
      }, {
        id: 3,
        text: 'Write README',
        selected: false
      }, {
        id: 4,
        text: 'Create some examples',
        selected: false
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it',
        selected: false
      }, {
        id: 6,
        text: '???',
        selected: false
      }, {
        id: 7,
        text: 'PROFIT',
        selected: false
      }],
      cardsInBox: [],
      selectedCards: [],
      mostRecentlyMovedCards: []
    };
  }

  moveSelectedCardsToBox() {
    var selectedIds = this.state.cards.filter(card => card.selected).map(card => card.id);
    this.setState(update(this.state, {
      cardsInBox: { $push: selectedIds },
      mostRecentlyMovedCards: { $set: selectedIds }
    }));
  }

  completeBoxMove() {
    var selectedIds = this.state.cards.filter(card => card.selected).map(card => card.id),
        unselectedCards = this.state.cards.map(function (card) {
          card.selected = false;
          return card;
        });

    this.setState({
      cards: unselectedCards,
      mostRecentlyMovedCards: []
    });
  }

  moveRecentCardsBackFromBox() {
      var cardsToRemove = this.state.mostRecentlyMovedCards,
          cardsInBox = this.state.cardsInBox.filter(id => cardsToRemove.indexOf(id) === -1);

      this.setState({ cardsInBox: cardsInBox });
  }

  selectCard(e, id) {
      // indices?
      var currentlySelectedIndexes = this.state.cards.map((card, index) => card.selected ? index : null).filter(index => index !== null),
          combineSelections = function (currentIndex, lastIndex, e) {
              var indexOfIndex = currentlySelectedIndexes.indexOf(currentIndex); // sorry

              if (indexOfIndex !== -1 && !e.dragging) {
                  currentlySelectedIndexes.splice(indexOfIndex, 1);
              } else if (indexOfIndex === -1) {
                  currentlySelectedIndexes.push(currentIndex);
              }
              if (e.shiftKey) {
                  // bit hacky, doesn't fully account for single click selection
                  var indexesToAdd = lastIndex <= currentIndex ? _.range(lastIndex, currentIndex+1): _.range(currentIndex, lastIndex+1);
                  currentlySelectedIndexes = currentlySelectedIndexes.concat(indexesToAdd);
              }
              return currentlySelectedIndexes; 
          },
          indexOfCurrent = _.findIndex(this.state.cards, (card => card.id === id)),
          selectedIndexes = combineSelections(indexOfCurrent, this.state.anchorIndex, e),
          updateCard = function (card, index) {
              if (selectedIndexes.indexOf(index) !== -1) {
                  card.selected = true;
              } else {
                  card.selected = false;
              }
              return card;
          },
          updatedCards = this.state.cards.map(updateCard);

    this.setState({
        cards: updatedCards,
        anchorIndex: e.shiftKey ? this.state.anchorIndex : indexOfCurrent
    });
  }

  render() {
    const { cards } = this.state;
    const boxCards = cards.filter(card => this.state.cardsInBox.indexOf(card.id) !== -1).map(card => {
      return (card.text)
    });

    return (
      <div style={style}>
        <div style={{ float: 'left' }}>
          {cards.filter(card => this.state.cardsInBox.indexOf(card.id) === -1).map(card => {
            return (
              <Card key={card.id}
                    id={card.id}
                    text={card.text}
                    completeBoxMove={this.completeBoxMove}
                    moveRecentCardsBackFromBox={this.moveRecentCardsBackFromBox}
                    selectCard={this.selectCard}
                    selected={card.selected} />
            );
          })}
        </div>
        <div style={{ float: 'right'}}>
          <BoxTarget  items={boxCards}
                      moveSelectedCardsToBox={this.moveSelectedCardsToBox}/>
        </div>
      </div>
    );
  }
}
