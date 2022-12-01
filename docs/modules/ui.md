# UI

This module allows to register new UI components and to create UI elements from them. It's built in top of
[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

## IUIStore

The `IUIStore` interface is used to register new `UIElements`. It can be accessed using `Dinovel` root object.

### Registering a new UI element

`UIElements` are registered using the `register` method. If the name is already used, it will throw an error. An element
can be overriden by passing `true` in the second argument.

```typescript
Dinovel.ui.register({
  name: 'MyButton',
  template: `
    <button class="my-button">
      <slot></slot>
    </button>
  `,
  styles: {
    '.my-button': {
      backgroundColor: 'red',
    },
  },
});
```

### Loading elements into the DOM

When `register` is called, the element is not yet available in the DOM. To load it, you need to use the `load` method.
This only needs to be called once, since from then on, the element will be available in the DOM.

## UIElement

The `UIElement` struct has the following properties:

- `name`: The name of the element. This is the name that will be used to create the element in the DOM. It's a required
  field.
- `beforeLoad`: A function that will be called before the element is loaded into the DOM registry. If it returns a falsy
  value, the element will not be loaded.
- `template`: The HTML template of the element.
- `styles`: The CSS styles of the element. They are scoped to the element.
- `init`: A function that will be called when the element is created. It receives the
  [ShadowDOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) as argument.
- `connectedCallback`, `disconnectedCallback` and `attributeChangedCallback`: The
  [lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
  of the element.
- `attributes`: Object in which the keys are the names of the custom attributes and the values are either a function to
  listen for changes or an boolen that defines if changes should be listened for.
- `extends`: An class that the element will extend. It can be a native element or another custom element.

### Example

```typescript
const FullElement: UIElement = {
  name: 'full-element',
  beforeLoad: () => true,
  template: `<div class="full-element"><slot></slot></div>`,
  styles: {
    '.full-element': {
      width: '100%',
      height: '100%',
    },
  },
  init: (shadow) => {
    const p = document.createElement('p');
    p.textContent = 'Hello world!';
    shadow.appendChild(p);
  },
  connectedCallback: () => {
    console.log('connected');
  },
  disconnectedCallback: () => {
    console.log('disconnected');
  },
  attributeChangedCallback: (name, oldValue, newValue) => {
    console.log('attribute changed', name, oldValue, newValue);
  },
  attributes: {
    isValid: (value) => {
      console.log('IsValid changed', value);
    },
    ref: false, // don't listen for changes
  },
  extends: class extends HTMLElement {
    constructor() {
      super();
      console.log('constructor');
    }
  },
};
```
