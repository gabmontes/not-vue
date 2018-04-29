# Exploring NotVue

As with [not-jQuery](https://gist.github.com/gabmontes/535a7b3b059b2a301a55b43e90ee0101) and [notReact](https://github.com/gabmontes/exploring-not-react) in the past, this is a quick research to grasp what does it take to replicate the base functionality of [Vue.js](https://vuejs.org/) following their [Getting Started](https://vuejs.org/v2/guide/) guide.

Check `src/not-vue.js` for the *final* version of the code with nice comments and the `examples` folder for a progressive implementation of the framework.

## Preliminary conclusions

The *final* implementation is very basic and the size of the code appears to grow somehow exponentially as new features are added.

Test version | New capability | Size
--- | --- | ---
1a | Text interpolation | 0.2k
1b | Reactive text interpolation | 0.6k
2 | Attributes binding | 1.1k
3 | Conditional rendering | 1.2k
4 | Loops | 2.2k

The base implementation of loops, `v-for` directive, almost duplicated the size and increased the complexity a lot, even when it still lacks of many expected sub-features.

Some other basic features were not implemented and might not even be possible to implement based on the current code:

1. Nested props - only fist-level props bind reactively.
1. Array props - as a consequence of 1, is not possible to manipulate the arrays and expect the UI to react; arrays need to be replaced entirely to do so.
1. User input - forget about events handling...
1. Components - no way!
