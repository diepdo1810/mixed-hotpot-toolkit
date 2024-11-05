// RateLimiter.ts

interface RateLimiterState {
  requestsPerMinute: number;
  requestsPerDay: number;
  lastResetTime: number;
  lastDayResetTime: number;
}

const maxRequestsPerMinute = 15;
const maxRequestsPerDay = 150;

class RateLimiter {
  private state: RateLimiterState;

  constructor() {
    this.state = {
      requestsPerMinute: 0,
      requestsPerDay: 0,
      lastResetTime: Date.now(),
      lastDayResetTime: Date.now(),
    };
  }

  // Load state from Chrome storage
  async loadState() {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.get(['rateLimiterState'], (data) => {
        if (data.rateLimiterState) {
          this.state = { ...this.state, ...data.rateLimiterState };
        }
        resolve();
      });
    });
  }

  // Save state to Chrome storage
  saveState() {
    chrome.storage.sync.set({ rateLimiterState: this.state });
  }

  // Reset requests per minute and requests per day if needed
  resetIfNeeded() {
    const now = Date.now();
    const minuteInMs = 60 * 1000;
    const dayInMs = 24 * 60 * 60 * 1000;

    // Reset requests per minute
    if (now - this.state.lastResetTime >= minuteInMs) {
      this.state.requestsPerMinute = 0;
      this.state.lastResetTime = now;
    }

    // Reset requests per day
    if (now - this.state.lastDayResetTime >= dayInMs) {
      this.state.requestsPerDay = 0;
      this.state.lastDayResetTime = now;
    }
  }

  // Check if request limit is exceeded
  canRequest(): boolean {
    this.resetIfNeeded();
    return (
      this.state.requestsPerMinute < maxRequestsPerMinute &&
      this.state.requestsPerDay < maxRequestsPerDay
    );
  }

  // Record a new request and save the state
  recordRequest() {
    this.state.requestsPerMinute += 1;
    this.state.requestsPerDay += 1;
    this.saveState();

    console.log('Request recorded');
    console.log('Requests per minute:', this.state.requestsPerMinute);
    console.log('Requests per day:', this.state.requestsPerDay);
    console.log('Last reset time:', this.state.lastResetTime);
  }
}

export default RateLimiter;
