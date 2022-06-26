# Technical Details

## Users
All users are firebase anon users

## Game data
All game data is synced through firebase realtime database. Each game gets a Game object, as described in `game.ts`. This contains everything, from the players, the current round, the score, etc.

## Game Loop
The game can be modeled as a finite state machine. See the below DOT code and the image `GAME_FSM.png`

```dot
digraph fsm {
  rankdir=LR;
	size="8,5"

	# Waiting for the game to start
	node [shape = doublecircle]; WAITING;

	# Show rules
	node [shape = circle] STARTING;
	# Asker asks a question
	node [shape = circle] ASK_QUESTION;
	# Everyone answers
	node [shape = circle] ANSWERING;
	# View aggregate results
	node [shape = circle] VIEW_RESULTS;
	# Flip the coin
	node [shape = circle] COIN_FLIP;
	# Reveal individual results
	node [shape = circle] REVEAL;
	# Don't reveal individual results
	node [shape = circle] NO_REVEAL;
	# Go back to lobby
	node [shape = circle] FINISHED;

	# state transitions with associated conditions and output actions
  WAITING -> STARTING [label="START"];
  FINISHED -> STARTING [label="RESTART"];
  STARTING -> ASK_QUESTION [label="*"];
  ASK_QUESTION -> ANSWERING [label="SUBMIT_QUESTION"];
  ANSWERING -> VIEW_RESULTS [label="READY"];
	VIEW_RESULTS -> COIN_FLIP [label="*"];
  COIN_FLIP -> REVEAL [label="HEADS"];
  COIN_FLIP -> NO_REVEAL [label="TAILS"];
  REVEAL -> ASK_QUESTION [label="!END"];
  NO_REVEAL -> ASK_QUESTION [label="!END"];

  REVEAL -> FINISHED [label="END"];
  NO_REVEAL -> FINISHED [label="END"];
}
```

