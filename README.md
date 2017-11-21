# Extract-styles

**A node tool to generate a theme from SCSS files.**

Extract-styles analyzes input SCSS files and extracts all definitions marked with a special 'theme' comment.

You can later load the resulting theme file, set the theme class on the body/root of the page to apply the new styles.

## Before/after

Write your SCSS as you'd normally do, but mark the lines required in the theme file with `@theme`:

```scss
.foo {
  width: 100%;
  color: #ffff00; // @theme
  font-weight: bold;
  border: 1px solid #ff0000; // @theme
  
  &__content {
    padding: 10px;
    background-color: #eee; // @theme
  }
}
```

After running **`extract-styles`**, you'll get a theme file with the marked lines extracted:

```scss
.theme-default {
  .foo {
    color: #ffff00;
    border: 1px solid #ff0000;
  
    &__content {
      background-color: #eee;
    }
  }
}    
```

## Install


```sh
$ npm install extract-styles --save-dev
```

## Usage: CLI

Start the CLI and progress step-by-step with style extraction:

```sh
$ ./node_modules/.bin/extract-styles
```

Combine the following options to use with watchers (`npm-watch` or `nodemon`):

```sh
$ ./node_modules/.bin/extract-styles --root src --output src/themes/theme.scss --template t.tpl --mark @myTheme
``` 

```
--root      Define the root directory to start searching for SCSS files.
--output    The resulting SCSS theme file. Supply full path with filename and scss extension.
--template  Custom template for generating the theme file. Useful when you want to include imports.
--mark      Define a custom theme mark. It can be any string that will be unique for marking theme lines. (Default: @theme).
```

## Contributing

PRs are much appreciated!

Use `npm start` while coding and `npm test` to run unit tests.

## License

MIT &copy; [Marton Czebe](https://github.com/czebe)
