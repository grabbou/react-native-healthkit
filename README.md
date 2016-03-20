# react-native-healthkit
A React Native bridge module to access iOS HealthKit APIs

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

## Looking for a maintainer

Comment on [#3](https://github.com/elliottsj/react-native-healthkit/issues/3) if you'd like to take over this project.

## Installation

Follow https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking, then:

```js
import HealthKit from 'react-native-healthkit';

// ...

HealthKit.isHealthDataAvailable((err, result) => {
  // ...
});
```
