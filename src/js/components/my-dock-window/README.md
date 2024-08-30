# my-dock-window web component
The my-dock-window web component is a reusable and customizable web component that represents a window frame with a title bar and a content area. It can be used as a dockable window for sub-applications or as a standalone window element.

## Attributes
The following attributes can be used to customize the my-dock-window web component:

app - The sub-app to be placed in the window frame.
name - The name to be placed in the window frame.

## Events
The my-dock-window web component emits the following events:

closeWindow - Fired when the close button in the title bar is clicked.

## Example
```
<my-dock-window name="My App" app="sub-app"></my-dock-window>
```

## Styling
The my-dock-window web component can be styled by targeting its shadow DOM with CSS. The following CSS properties are available:

#frame - The main frame element.
#first - The title bar element.
#second - The content area element.
#namePlace - The name element in the title bar.
#close - The close button element in the title bar.