# random-selector-webapp
## Purpose

This very simple SPA was created to create simple lists, save them in browser storage and draw random items from them. That's really all it does.

## Branch:
- random-overhaul
  - [ ] new random generation view
  - [x] allow for a sequence of `n` items to be generated with certain distribution algorithm
  - [ ] make list items selectable for randomization
  - misc
    - [x] move all existing random functionality to new random view
    - [x] add button to switch main view <> random view
    - [x] mockup new random view

## TODO:
- [ ] Saving system
  - [ ] Change save() method to accept lists as input
- [ ] Randomization
  - [ ] exclusion of items from randomization without deletion from the list
  - [ ] generating a sequence of random items where each item is aprox. equally often included but not necessarily equally distributed
- [ ] Make list view scrollable and highlight current position in list
- [ ] Make everything less dependent on global variables
- [ ] Have js not parse entire storage list on every save
- [ ] - [ ] Exporting/importing lists as .csv and whatnot
- [ ] Design changes
  - [ ] Animations
- [ ] Cookie / Data collection disclaimer
- [ ] Info page with disclaimer and reference to this repo

## ISSUES:
- Selecting items for randomization in list view doesn't work properly
  - Doesn't unselect the very top box when one item is unselected
  - generates list of `undefined` when no item is selected
  - doesn't remove items from pool in certain circumstances
  - when manually unselecting items, they are only removed on the second random generation
## Dependencies:
This webapp now requires [bootstrap-input-spinner](https://github.com/shaack/bootstrap-input-spinner) by shaack to be cloned into `dependencies/bootstrap-input-spinner`.
 

## Saving Protocol Spec:

### V1.0
* `localStorage.list.lists = [{GUID, name, items[]}]`
* `localStorage.theme = "dark"/"light"`
* `localStorage.savingProtocolVersion = "1.0"`