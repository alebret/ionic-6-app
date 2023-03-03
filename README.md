# ionic-6-app

Création d'une application **Ionic 6** (Angular) utilisant **Capacitor**

## Description de l'appli

- Application avec 3 tabs
- Une tab inclut un plugin natif (`device`)
- Une tab inclut une fontionnalité de prise de photo (utilisation de `Camera`) et de galerie
- Une tab inclut un composent custom (un bouton) avec un style modifié & l'appel d'une plugin natif Android

## Liens

- Tuto : https://ionicframework.com/docs/angular/your-first-app
- IDE : VS Code avec l'extension Ionic (inclus de nombreuses actions sans passer par les commandes)

## Plarformes dispo

- Web (par défaut)
- Android

Pour la synchro du code "initialement web" avec les plateformes natives, il est possible de passer par l'extension Ionic sur VS Code, sinon :

```
ionic cap copy
ionic cap sync
```

## Exemple de commandes

- Lancer le projet sur la plateforme web : `ionic serve`
- Lancer le projet sur la plateforme Android : `ionic cap run android` (`cap` pour capacitor)
- Lancer le projet sur la plateforme Android avec le live reload : `ionic cap run android -l --external`
