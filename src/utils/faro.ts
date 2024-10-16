import { initializeFaro } from '@grafana/faro-web-sdk';

export function initFaro() {
  initializeFaro({
    url: "http://...",  // required, see below
    app: {
      name: "app-name", // required
      version: "1.2.3"  // optional; useful in Grafana to get diff between versions
    }
  });
}
