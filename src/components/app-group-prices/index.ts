import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-group-prices')
export class AppGroupPrices extends LitElement {
  static styles = css`
    h4 {
      margin: 0;
      margin-bottom: 0.875rem;
      font-size: 0.875rem;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.875rem;
    }
    .container.card {
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: #f1f1f1;
      box-shadow: 1px 1px 13px rgba(0, 0, 0, 0.13);
    }

    .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.875rem;
    }
    .row > div {
      width: 33.33%;
    }
    .row-header {
      align-items: flex-start;
    }

    .row-title {
      font-size: 0.75rem;
    }
    
    .row-title > div:first-child {
      font-weight: bold;
    }
    .no-vip {
      font-size: 0.75rem;
      text-align: center;
    }

    .column-title {
      font-weight: bold;
      font-size: 0.75rem;
      text-align: center;
    }
    .vip-name {
      font-size: 0.75rem;
      font-weight: normal;
      font-style: italic;
    }

    .colored {
      color: #6d28d9;
      /* color: #4a9bd7; */
    }
    
    .loader {
      width: 100%;
      height: 20px;
      background: linear-gradient(90deg, #cccccc 25%, #e9e9e9 50%, #cccccc 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    .loader.usd-today {
      width: 1.5rem;
      height: 0.875rem;
      display: inline-block;
      vertical-align: middle;
    }
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;

  @property({type: Object})
  date = {
    sale: '',
    today: '',
  };

  @property({type: Object})
  usdValue = {
    sale: 0,
    today: 0,
  };

  @property({type: Object})
  peso = {
    price: 0,
    serviceCharge: 0,
    vip: 0,
  };

  @property({type: Object})
  usd = {
    price: 0,
    vip: 0,
  };

  @property({type: Object})
  recommended = {
    price: 0,
    vip: 0,
  };

  @property()
  vipPackage = '';

  render() {
    return html`
      <h4>
        Entradas compradas el ${this.date.sale}:
      </h4>
      <div class="container card">
        <div class="row row-header">
          <div class="column-title">
          </div>
          <div class="column-title">
            General
          </div>
          <div class="column-title">
            <div>VIP</div>
            ${this.peso.vip > 0 ?
              html`<div class="vip-name">(${this.vipPackage})</div>`
              :
              html``
            }
          </div>
        </div>
        <div class="row">
          <div class="row-title">
            <div>
              Venta general
            </div>
            <div>
              ${this.date.sale}
            </div>
          </div>
          <div>
            <app-price
              price=${`$ ${this.peso.price + this.peso.serviceCharge}`}
              bottom-info=${`$${this.peso.price} + $${this.peso.serviceCharge} service charge`}
            ></app-price>
          </div>
          <div>
            ${this.peso.vip > 0 ?
              html`<app-price
                price=${`$ ${this.peso.vip}`}
                bottom-info=${`Los VIP no tienen service charge`}
              ></app-price>`
              :
              html``
            }
          </div>
        </div>
        <div class="row">
          <div class="row-title">
            <div>
              En dólares
            </div>
            <div>
              (dólar ${this.date.sale} $${this.usdValue.sale})
            </div>
          </div>
          <div>
            <app-price
              price=${`us$ ${this.usd.price}`}
            ></app-price>
          </div>
          <div>
            ${this.peso.vip > 0 ?
              html`<app-price
                price=${`us$ ${this.usd.vip}`}
              ></app-price>`
              :
              html`<div class="no-vip">No hubo VIP para este sector</div>`
            }
          </div>
        </div>
        ${this.usdValue.today > 0 ?
          html`
            <div class="row">
              <div class="row-title">
                <div>
                  Precio de reventa recomendado
                </div>
                <div>
                  (dólar hoy $${this.usdValue.today})
                </div>
              </div>
              <div class="colored">
                <app-price
                  price=${`$ ${this.recommended.price}`}
                ></app-price>
              </div>
              <div class="colored">
                ${this.peso.vip > 0 ?
                  html`<app-price
                    price=${`$ ${this.recommended.vip}`}
                  ></app-price>`
                  :
                  html``
                }
              </div>
            </div>
          `
          :
          html`
            <div class="row">
              <div class="row-title">
                <div>
                  Precio de reventa recomendado
                </div>
                <div>
                  (dólar hoy <span class="loader usd-today"></span>)
                </div>
              </div>
              <div class="loader">
              </div>
              <div class="loader">
              </div>
            </div>
          `
        }
      </div>
    `;
  }
}
