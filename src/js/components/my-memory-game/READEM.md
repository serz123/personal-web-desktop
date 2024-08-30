# my-memory-game Web Component
The my-memory-game web component is a reusable and customizable web component that represents a memory game. It can be used as a standalone element.

## Attributes
The following attributes can be used to customize the my-memory-game web component:
boardsize - The size of the game board.

## Events
The my-memory-game web component emits the following events:

closeWindow - Fired when the close button in the title bar is clicked.

## Example
```
<my-memory-game boardsize="medium"></my-memory-game>
```

## Styling
The my-memory-game web component can be styled using the following CSS variables:

--tile-size - The width of a tile (default: 80px).
--tile-size2 - The height of a tile (default: 120px).

### CSS Parts
The following CSS parts are available for styling:

my-flipping-tile - The flipping tile element.
my-flipping-tile::part(tile-back) - The back part of the flipping tile.
button - The game board size button.