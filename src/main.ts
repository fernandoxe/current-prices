import './style.css';
import {html, css, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import './components/app-title';
import './components/app-stadium';
import './components/app-prices';

import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', import.meta.env.VITE_SITE_URL],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.5, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

@customElement('app-home')
export class AppHome extends LitElement {
  static styles = css`
    .container {
      padding: 1rem;
      display: flex;
      gap: 1rem;
      max-width: 768px;
      margin: 0 auto;
      flex-wrap: wrap;
    }
    .title {
      width: 100%;
    }
    .stadium {
      width: 100%;
    }
    .prices {
      width: 100%;
    }
    @media (min-width: 640px) {
      .stadium {
        width: calc(50% - 0.5rem);
      }
      .prices {
        width: calc(50% - 0.5rem);
      }
    }
  `;

  @state()
  private selectedSector = '';

  @state()
  private usdToday = 0;
  
  private convertPrice(price: string) {
    const converted = parseFloat(price.replace('.', '').replace(',', '.'));
    return converted;
  }

  private async getUsdValue() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(import.meta.env.VITE_API_URL, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Request failed, response not ok, status code: ${response.status}`);
      }

      const data = await response.json();
      
      if(!data.venta) {
        throw new Error(`Cannot read venta value: [${data.venta}]`);
      }

      const convertedPrice = this.convertPrice(data.venta);
      this.usdToday = convertedPrice;
    } catch (error) {
      // console.error(error);
      Sentry.captureException(error);
    }
  };

  private handleClick(event: CustomEvent) {
    if(!this.usdToday) {
      this.getUsdValue();
    }
    const { id } = event.detail;
    this.selectedSector = id;
    gtag('event', 'sector_selected', {sector: id});
  }

  render() {
    return html`
      <div class="container">
        <div class="title">
          <app-title></app-title>
        </div>
        <div class="stadium">
          <app-stadium @onselected=${this.handleClick}></app-stadium>
        </div>
        <div class="prices">
          <app-prices
            priceid=${this.selectedSector}
            usdToday=${this.usdToday}
          ></app-prices>
        </div>
      </div>
    `;
  }
}
