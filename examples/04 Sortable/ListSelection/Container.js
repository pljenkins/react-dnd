import React, { Component } from 'react';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import update from 'react/lib/update';
import Card from './Card';
import BoxTarget from './BoxTarget';
import _ from 'lodash';
import SupportsTouch from '../../SupportsTouch';

const style = {
  width: 450,
  'margin-left': 50
},
  selectionA = 'A',
  selectionB = 'B';

var singleTouch;
// TODO-NK: have the option of doing fancy styling somewhere based on whether
// user is still dragging or not here, but this is good enough for now

export default class Container extends Component {
  supportsTouch = undefined;
  selectionStyle = selectionA;
  constructor(props) {
    super(props);
    this.moveRecentCardsBackFromBox = this.moveRecentCardsBackFromBox.bind(this);
    this.moveSelectedCardsToBox = this.moveSelectedCardsToBox.bind(this);
    this.completeBoxMove = this.completeBoxMove.bind(this);
    this.debounceTouch = this.debounceTouch.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.selectCardStyleA = this.selectCardStyleA.bind(this);
    this.selectCardStyleB = this.selectCardStyleB.bind(this);
    this.setSelectionStyleA = this.setSelectionStyleA.bind(this);
    this.setSelectionStyleB = this.setSelectionStyleB.bind(this);
    this.supportsTouch = SupportsTouch();
    console.log('constructor this.supportsTouch', this.supportsTouch);
    this.state = {
      cards: [{
        id: 1,
        text: 'Frank',
        selected: false
      }, {
        id: 2,
        text: 'And Drag N Drop',
        selected: false
      }, {
        id: 3,
        text: 'Unite!',
        selected: false
      }, {
        id: 4,
        text: 'Fancy DNA Sample',
        selected: false
      }, {
        id: 5,
        text: 'Tumor Tissue',
        selected: false
      }, {
        id: 6,
        text: 'Blood Sample',
        selected: false
      }, {
        id: 7,
        text: 'Feather',
        selected: false
      }, {
        id: 8,
        text: 'Knight',
        selected: false
      }, {
        id: 9,
        text: 'Sparkles',
        selected: false
      }, {
        id: 10,
        text: 'Boots',
        selected: false
      }, {
        id: 11,
        text: 'Hodor!',
        selected: false
      }, {
        id: 12,
        text: 'Bone Marrow',
        selected: false
      }, {
        id: 13,
        text: 'Epithelial Cells',
        selected: false
      }, {
        id: 14,
        text: 'FFPE',
        selected: false
      }, {
        id: 15,
        text: 'Frank2',
        selected: false
      }, {
        id: 16,
        text: 'And Drag N Drop2',
        selected: false
      }, {
        id: 17,
        text: 'Unite!2',
        selected: false
      }, {
        id: 18,
        text: 'Fancy DNA Sample2',
        selected: false
      }, {
        id: 19,
        text: 'Tumor Tissue2',
        selected: false
      }, {
        id: 20,
        text: 'Blood Sample2',
        selected: false
      }, {
        id: 21,
        text: 'Feather2',
        selected: false
      }, {
        id: 22,
        text: 'Knight2',
        selected: false
      }, {
        id: 23,
        text: 'Sparkles2',
        selected: false
      }, {
        id: 24,
        text: 'Boots2',
        selected: false
      }, {
        id: 25,
        text: 'Hodor!2',
        selected: false
      }, {
        id: 26,
        text: 'Bone Marrow2',
        selected: false
      }, {
        id: 27,
        text: 'Epithelial Cells2',
        selected: false
      }, {
        id: 28,
        text: 'FFPE2',
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

  debounceTouch(e, id) {
    console.log('debounceTouch', e.targetTouches.length, id, e);
    if (e.targetTouches.length === 1) {
      singleTouch = _.debounce(this.selectCard, 100);
      singleTouch(e, id);
    } if (e.targetTouches.length === 2) {
      if (!_.isUndefined(singleTouch)) {
        singleTouch.cancel();
      }
      this.selectCard(e, id);
      e.preventDefault();
    }
  }

  selectCard(e, id) {
    if (this.selectionStyle === selectionA) {
      this.selectCardStyleA(e, id);
    } else if (this.selectionStyle === selectionB) {
      this.selectCardStyleB(e, id);
    } else {
      console.log('Unknown selection style!!');
    }
  }

  selectCardStyleA(e, id) {
    e.targetTouches = e.targetTouches || [];
    console.log('selectCardStyleA arguments', e.targetTouches.length, id, e);

    if (e.targetTouches && e.targetTouches && e.targetTouches.length > 1) {
      e.shiftKey = true;
      console.log('selectCardStyleA multitouch');
    }
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
          updatedCards = this.state.cards.map(updateCard),
          wasDelecting = !this.state.cards[indexOfCurrent].selected;

    this.setState({
        cards: updatedCards,
        anchorIndex: e.shiftKey || wasDelecting ? this.state.anchorIndex : indexOfCurrent
    });
  }

  selectCardStyleB(e, id) {
    e.targetTouches = e.targetTouches || [];
    console.log('selectCardStyleB arguments', e.targetTouches.length, id, e);
    var indexOfCurrent = _.findIndex(this.state.cards, (card => card.id === id));
    var anchorIndex = undefined;

    if (e.shiftKey || (e.targetTouches && e.targetTouches && e.targetTouches.length > 1) && _.isUndefined(this.state.anchorIndex)) {
      anchorIndex = indexOfCurrent;
      console.log('selectCardStyleB multitouch');
    }
    // indices?
    var currentlySelectedIndexes = this.state.cards.map((card, index) => card.selected ? index : null).filter(index => index !== null),
      combineSelections = function (currentIndex, currentAnchorIndex, e) {
        var indexOfIndex = currentlySelectedIndexes.indexOf(currentIndex); // sorry

        if (indexOfIndex !== -1 && !e.dragging) {
          currentlySelectedIndexes.splice(indexOfIndex, 1);
        } else if (indexOfIndex === -1) {
          currentlySelectedIndexes.push(currentIndex);
        }
        if (!_.isUndefined(currentAnchorIndex)) {
          // bit hacky, doesn't fully account for single click selection
          var indexesToAdd = currentAnchorIndex <= currentIndex ? _.range(currentAnchorIndex, currentIndex+1): _.range(currentIndex, currentAnchorIndex+1);
          currentlySelectedIndexes = currentlySelectedIndexes.concat(indexesToAdd);
        }
        return currentlySelectedIndexes;
      },

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
      anchorIndex: anchorIndex
    });
  }

  setSelectionStyleA() {
    console.log('setSelectionStyleA');
    this.setState({
      cards: this.state.cards.map(card => {card.selected = false; return card}),
      anchorIndex: undefined
    });
    this.selectionStyle = selectionA;
  }

  setSelectionStyleB() {
    console.log('setSelectionStyleB');
    this.setState({
      cards: this.state.cards.map(card => {card.selected = false; return card}),
      anchorIndex: undefined
    });
    this.selectionStyle = selectionB;
  }

  render() {
    const { cards } = this.state;
    const boxCards = cards.filter(card => this.state.cardsInBox.indexOf(card.id) !== -1).map(card => {
      return (card.text)
    });

    return (
      <div style={style}>
        <div style={{display: 'inline-block', 'margin-bottom': 30}}>
          <label for="selection-style-A"><input type="radio" name="selectionStyle" id="selection-style-A" defaultChecked={true} onChange={this.setSelectionStyleA}/>Selection style A</label>
          <label for="selection-style-B"><input style={{'margin-left': 20}} type="radio" name="selectionStyle" id="selection-style-B" onChange={this.setSelectionStyleB}/>Selection style B</label>
        </div>
        <div style={{ float: 'left' }}>
          {cards.filter(card => this.state.cardsInBox.indexOf(card.id) === -1).map((card, index) => {
            return (
              <Card key={card.id}
                    id={card.id}
                    text={card.text}
                    completeBoxMove={this.completeBoxMove}
                    moveRecentCardsBackFromBox={this.moveRecentCardsBackFromBox}
                    selectCard={this.selectCard}
                    debounceTouch={this.debounceTouch}
                    selected={card.selected}
                    supportsTouch={this.supportsTouch}
                    isAnchor={this.selectionStyle === selectionB && index === this.state.anchorIndex} />
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
