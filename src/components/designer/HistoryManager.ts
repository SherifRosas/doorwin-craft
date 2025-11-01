export class HistoryManager<T> {
  private history: T[] = [];
  private currentIndex = -1;
  private maxHistory = 50;

  push(state: T) {
    // Remove any future states if we're in the middle of history
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new state
    this.history.push(JSON.parse(JSON.stringify(state))); // Deep clone
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): T | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  redo(): T | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}




