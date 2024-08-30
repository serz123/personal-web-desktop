### my-message
The my-message web component is a reusable and customizable web component that allows users to input and submit text messages. It includes an input field, a submit button, and an emoji picker. The component emits the emojiSelected event when an emoji is selected in the emoji picker.

## Attributes
The following attributes can be used to customize the my-message web component:

## Events
The my-message web component emits the following events:

emojiSelected: Fired when an emoji is selected in the emoji picker. The detail property of the event contains the selected emoji.

## Example
```
<my-message></my-message>
```

## Styling
The my-message web component can be styled using CSS. The following CSS selectors are available:

.user: The input field for the user's message.
#set: The submit button for the user's message.
#container: The container element for the my-message component.
#emoji-button: The button to open the emoji picker.
#emoji-picker: The container element for the emoji picker.
.hidden: A class that can be added to elements to hide them from view.