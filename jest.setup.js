// jest.setup.js
console.log("Setting up Jest tests...");
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Optionally mock a resize event here
  }
  unobserve() {
    // Disconnect mock
  }
  disconnect() {
    // Disconnect mock
  }
};
