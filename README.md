# Gyros

A JavaScript library for creating shiny effects on HTML elements using gyroscope or mouse movement.

## Installation

```bash
npm install @primajin/gyros
```

## Basic Usage

```html
<div class="gyros-element"></div>
```

```javascript
import Gyros from '@primajin/gyros';

new Gyros('.gyros-element');
```

## Options

You can pass an options object as the second argument to the `Gyros` constructor.

| Option      | Type     | Default                               | Description                                                                                              |
|-------------|----------|---------------------------------------|----------------------------------------------------------------------------------------------------------|
| `material`  | `string` or `object` | `'gold'`                              | The material to use for the shiny effect. Can be a predefined material name or a custom material object. |
| `shininess` | `string` | `'polished'`                          | The shininess level to use. Can be `'polished'` or `'matte'`.                                             |
| `fallback`  | `array`  | `['gyroscope', 'mouse', 'static']`    | The order of fallback mechanisms to use.                                                                 |
| `sensitivity` | `number` | `50`                                  | The update frequency of the effect, in milliseconds. A lower number means more frequent updates.         |

### Custom Materials

You can create your own custom materials by passing an object to the `material` option.

```javascript
new Gyros('.gyros-element', {
  material: {
    polished: ['#ff0000', '#00ff00', '#0000ff'],
    matte: ['#800000', '#008000', '#000080'],
  }
});
```
