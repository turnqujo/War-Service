# War.JS

## Running the Game

**This program requires Node to run.**
Start with an `npm install`, then the program can be run using `npm start` from a command line at the project directory.

## Running the Tests

This project uses Jest for testing. The tests can be run using `npm test`, and a coverage report can be generated using `npm test -- --coverage`.
Jest was chosen due to its simplicity, likeness to existing test frameworks, and speed of configuration.

## About the Card Game, War

[Wikipedia Article](<https://en.wikipedia.org/wiki/War_(card_game)>)

## Differences Between "Standard" War and this Program

War is typically played with a standard 52-card deck between two players. The requirements given for this program allowed for the deck to be configured by number of suits and ranks, and allows for 1 or more players. This means that some mechanisms needed to be invented in order to handle non-standard games.

### Losing Conditions

There are several variations on how players lose the game. The approach I took was to have players who run out of cards be unable to gain any more cards for the rest of the game, effectively cutting them out. Whoever is left with the entire deck of cards wins.

### Suits

Suits are not regarded for scoring in War. They affect the game through the probability of players playing the same _rank_ of card, thus causing wars to start. Want more wars to happen? Increase the number of suits and decrease the number of ranks in your deck.

### Ranks

In War, ranks are ordered as such: `A K Q J 10 9 8 7 6 5 4 3 2`.
Since the number of ranks in the deck used for War.JS is configurable as a number, cards are considered only by a "converted, numerical rank", and so do not have non-numerical names or values.

## New Mechanisms

### Larger Scale Wars

One of the largest gameplay impacts of having multiple players in War was resolving wars. If a war starts between 8 players, the war will continue going until only one player is left, and they will win _all_ of the played cards in the war.

### Tie Resolution

In standard War, cards flow between two players who take part in all parts of the game, until one player has run out of cards. It is impossible for players to tie in a way which cannot be resolved by starting a war.

In War.JS, some players may enter a battle while others wait for the battle to complete. This can give rise to a situation where two players enter a battle with not enough cards to actually _complete_ the battle, and so they will tie. In another way, take a game situation such as this:

#### Starting turn

```
Player 1: 20 cards
Player 2: 2 cards
Player 3: 2 cards
Player 4: 18 cards
```

#### Played Cards

```
Player 1: Rank 1
Player 2: Rank 7
Player 3: Rank 7
Player 4: Rank 2
```

#### Move to War

Players 2 and 3 have tied, but each only have one card left. Players 1 and 4 are still in the game, but lost this round and so have to wait for players 2 and 3 to carry out their war.

Since the steps of war are:

1. Put a card in the prize pool (face-down stack)
2. Play a card face-up

This means that both players 2 and 3 are able to put their last cards in the prize pool, _but they cannot_ play a card face-up.

#### Resolution

In order to break the tie, I wrote in a simple mechanism which will select a winner at random from the war participants. In such a case, one player will be out of the game, while the winner will have won their cards, allowing the game to continue.

## What's War Logic?

War logic is a file containing functions which were pretty War-specific. I noticed it could be possible to reuse much of the code in this project for a totally different card game, as well as other variations of War. Such games and variations would be "drivers", and could share these functions if it made sense. `lib/common-actions` is a similar idea, but with more generic operations which could be relevant to all sorts of card games.
