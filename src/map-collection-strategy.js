import {CollectionStrategy} from './collection-strategy';

export class MapCollectionStrategy extends CollectionStrategy {
  getCollectionObserver(items){
    return this.observerLocator.getMapObserver(items);
  }

  processItems(items) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let index = 0;
    let row;
    let view;

    items.forEach((value, key) => {
      row = this.createFullBindingContext(value, index, items.size, key);
      view = viewFactory.create(row);
      viewSlot.add(view);
      ++index;
    });
  }

  handleChanges(map, records) {
    let viewSlot = this.viewSlot;
    let key;
    let i;
    let ii;
    let view;
    let children;
    let length;
    let row;
    let removeIndex;
    let record;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
      case 'update':
        removeIndex = this._getViewIndexByKey(key);
        viewSlot.removeAt(removeIndex, true);
        row = this.createBaseBindingContext(map.get(key), key);
        view = this.viewFactory.create(row);
        viewSlot.insert(removeIndex, view);
        break;
      case 'add':
        row = this.createBaseBindingContext(map.get(key), key);
        view = this.viewFactory.create(row);
        viewSlot.insert(map.size, view);
        break;
      case 'delete':
        if (!record.oldValue) { return; }
        removeIndex = this._getViewIndexByKey(key);
        viewSlot.removeAt(removeIndex, true);
        break;
      case 'clear':
        viewSlot.removeAll(true);
        break;
      default:
        continue;
      }
    }

    children = viewSlot.children;
    length = children.length;

    for (i = 0; i < length; i++) {
      this.updateBindingContext(children[i].bindingContext, i, length);
    }
  }

  _getViewIndexByKey(key) {
    let viewSlot = this.viewSlot;
    let i;
    let ii;
    let child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) { // TODO (martingust) better way to get index?
      child = viewSlot.children[i];
      if (child.bindings[0].source[this.key] === key) {
        return i;
      }
    }
  }
}