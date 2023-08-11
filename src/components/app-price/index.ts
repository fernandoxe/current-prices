import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-price')
export class AppPrice extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .top-info {
      font-size: 0.75rem;
      text-align: center;
    }
    .price {
      font-size: 1.125rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
    }
    .bottom-info {
      font-size: 0.75rem;
      text-align: center;
    }
  `;

  @property()
  price = '';

  @property()
  'top-info' = '';

  @property()
  'bottom-info' = '';

  render() {
    return html`
      <div class="container">
        ${this['top-info'] && html`
          <div class="top-info">
            ${this['top-info']}
          </div>
        `}
        <div class="price">
          <div>
            ${this.price}
          </div>
        </div>
        ${this['bottom-info'] && html`
          <div class="bottom-info">
            ${this['bottom-info']}
          </div>
        `}
      </div>
    `;
  }
}