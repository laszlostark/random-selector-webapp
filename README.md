# random-selector-webapp
## Purpose

This very simple SPA was created to create simple lists, save them in browser storage and draw random items from them. That's really all it does.


## TODO:
- [ ] Saving system
  - [ ] Change save() method to accept lists as input
- [ ] Randomization
  - [ ] exclusion of items from randomization without deletion from the list
  - [ ] generating a sequence of random items where each item is aprox. equally often included but not necessarily equally distributed
- [ ] Make everything less dependent on global variables
- [ ] Have js not parse entire storage list on every save
- [ ] - [ ] Exporting/importing lists as .csv and whatnot
- [ ] Design changes
  - [ ] Animations



## Saving Protocol Spec:

### V1.0
* `localStorage.list.lists = [{GUID, name, items[]}]`
* `localStorage.theme = "dark"/"light"`
* `localStorage.savingProtocolVersion = "1.0"`