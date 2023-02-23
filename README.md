# random-selector-webapp
## Purpose

This very simple SPA was created to create simple lists, save them in browser storage and draw random items from them. That's really all it does.


## Feature set:
- [x] List management
  - [x] Creating, saving and loading lists
  - [x] Editing, renaming, deleting lists
- [ ] Drawing random items from lists
  - [x] Drawing single random items
  - [ ] Drawing a sequence of random items
- [ ] Exporting/importing lists
  - [ ] csv
  - [ ] ...?
- [ ] Design changes
  - [ ] Animations
  - [x] Theme toggle


## TODO:
- [ ] Saving system
  - [ ] Change save() method to accept lists as input
- [ ] Randomization
  - [ ] exclusion of items from randomization without deletion from the list
  - [ ] generating a sequence of random items where each item is aprox. equally often included but not necessarily equally distributed
- [ ] Make everything less dependent on global variables
- [ ] Merge Feature set and TODO list in readme, I'm just too lazy at this point