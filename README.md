### Angular2 Playground

Angular2-rc1 environment based on:

* [Gulp](http://gulpjs.com/)
* [SystemJS](https://github.com/systemjs/systemjs)
* [TypeScript](http://www.typescriptlang.org/)
* [TSLint](https://palantir.github.io/tslint/)
* [Hapi](http://hapijs.com/)

##### Articles on Angular 2

[Part 1](http://blog.brakmic.com/introduction-to-angular-2-part-1/)

[Part 2](http://blog.brakmic.com/introduction-to-angular-2-part-2/)

##### Screenshot

![demo](http://fs5.directupload.net/images/160507/8ly9fgn4.png)

##### Installation

```
npm install
```

##### Running (with Hapi web-server)

```
npm start
```
![server](http://fs5.directupload.net/images/160507/mb5jjuml.png)

##### Building (with linting, bundling &amp; deployment)

```
gulp
```
![gulp](http://fs5.directupload.net/images/160507/9f43evtc.png)

Instead of the usual myriad of scripts the *index.html* in this demo only contains two script-tags.

![index.html](http://fs5.directupload.net/images/160507/jb6aovgl.png)

This is because we use **SystemBuilder** in *Gulpfile.js* to bundle all of the **@angular2** scripts &amp; other libs (shims, polyfills, systemjs itself etc.).

##### Minification

```
gulp minify
```
This will produce *app.js* &amp; *app.css* which should be used instead of the references from the above screenshot.

##### Watch with dynamic compilation and deployment

```
gulp watch
```

##### LICENSE

[MIT](https://github.com/brakmic/Angular2-Playground/blob/master/LICENSE)
