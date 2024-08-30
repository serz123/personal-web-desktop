# my-flipping-tile
The my-flipping-tile web component is a reusable and customizable web component that represents a flipping tile with a front and back side. It can be used to create flipping tiles for games, presentations, or as a UI element for showing information.

## Attributes
The following attributes can be used to customize the my-flipping-tile web component:

face-up - Indicates whether the tile is flipped face up (boolean).
hidden - Indicates whether the tile is hidden (boolean).
disabled - Indicates whether the tile is disabled (boolean).

## Events
The my-flipping-tile web component does not emit any events.

## Example

```
<my-flipping-tile>
<img src="front.jpg" slot="front" alt="Front">
<img src="back.jpg" slot="back" alt="Back">
</my-flipping-tile>
```

## Styling
The my-flipping-tile web component can be styled using the following CSS selectors:

:host - Selects the host element.
:host([face-up]) - Selects the host element when it is face up.
:host([hidden]) - Selects the host element when it is hidden.
:host([disabled]) - Selects the host element when it is disabled.
#tile - Selects the button element that represents the tile.
#front - Selects the front element of the tile.
#back - Selects the back element of the tile.
slot - Selects the slot element that contains the content of the tile.
::slotted - Selects slotted elements, such as images, inside the slot element.