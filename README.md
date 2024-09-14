# AngularTemplate


## Command used to create project

```zsh
npx -p @angular/cli@16.0.0 ng new angular-template
```


## Angular v16 Requirements

https://v16.angular.io/guide/update-to-version-16#highlighted-breaking-changes-in-angular-v16

> - Angular requires Node.js v16 or v18
> - In Angular v16, TypeScript versions 4.9.3 up to, but not including 5.2.0, are supported, with no support for versions older than 4.9.3


## Install Dependencies

```sh
npm install
```

## Run Angular Development Server

```sh
npm run dev
```


## Command to create Component

```sh
npx ng generate component components/component-name

# Pages are also component so you can create them with the same command like this
npx ng generate component pages/page-name
```


## Command to create Directive

```sh
npx ng generate directive directives/directive-name
```

## Install Firebase

```sh
# https://firebase.google.com/docs/web/setup

npm install firebase
```


## Install Material

```sh
# https://material.angular.io/guide/getting-started

npx ng add @angular/material
```

## Material Icons

https://fonts.google.com/icons


## Material Components

https://v16.material.angular.io/components/categories


## mat-icon: How to switch between filled, outlined, rounded and two-toned icons?

https://github.com/angular/components/issues/11544#issuecomment-521305891

> This works for me:
>
> ```html
> <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet">
> 
> <mat-icon fontSet="material-icons-outlined">edit</mat-icon>
> ```



## Various Resources

### How to generate apps with older @angular/cli version

https://medium.com/ng-gotchas/easily-create-the-legacy-angular-apps-v2-v4-v5-v6-ee4a22d7eb60
