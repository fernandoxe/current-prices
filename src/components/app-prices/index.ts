import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { VIPPackagesRanges, stadiumRanges, stadiumSectors } from '../../data';
import '../app-price';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('app-prices')
export class AppPrices extends LitElement {
  static styles = css`
    h3, h4 {
      margin: 0;
    }
    h3 {
      font-size: 1rem;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .general-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .prices {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
    .row > div {
      width: 33.33%;
    }
    .column-title {
      font-weight: bold;
      font-size: 0.75rem;
      text-align: center;
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
    .first-column {
      width: 20%;
    }
    .square {
      display: inline-block;
      width: 0.875rem;
      height: 0.875rem;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
    }
    .colored {
      color: #6d28d9;
    }
    .final {
      font-size: 0.75rem;
      font-style: italic;
      margin-top: 1rem;
    }
    .loader {
      width: 100%;
      height: 20px;
      background: linear-gradient(90deg, #cccccc 25%, #e9e9e9 50%, #cccccc 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    .loader.usd-today {
      width: 1rem;
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

  @property()
  priceid = '';

  @property({type: Number})
  usdToday = 0;

  @state()
  private vip = '';

  @state()
  private price = {
    price: 0,
    serviceCharge: 0,
    vipPrice: 0,
    usd: 0,
    vipUsd: 0,
  };

  @state()
  private color = '';

  private getToday() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('es-AR', { month: 'long' });
    return `${day} de ${month}`;
  }

  private getPrice(id: string) {
    const sector = stadiumSectors[id];
    const priceRange = sector?.['price-range'] || '';
    this.vip = sector?.['VIP-package'] || '';

    const price = stadiumRanges[priceRange]?.price || 0;
    this.color = stadiumRanges[priceRange]?.color || '';
    const serviceCharge = stadiumRanges[priceRange]?.['service-charge'] || 0;
    const vipPrice = VIPPackagesRanges[this.vip]?.price || 0;
    
    this.price = {
      price,
      serviceCharge: price * serviceCharge,
      vipPrice,
      usd: Math.round((price + price * serviceCharge) / 485),
      vipUsd: Math.round(vipPrice / 485),
    };
  }

  protected performUpdate(): void | Promise<unknown> {
    this.getPrice(this.priceid);
    return super.performUpdate();
  }

  render() {
    if(!this.price.price) return html``;
    return html`
    <div class="container">
      <h3>
        <span class="square" style=${styleMap({'background-color': this.color})}>
        </span>
        <span class="text">
          ${this.priceid ? stadiumSectors[this.priceid].name : ''}
        </span>
      </h3>
      <div class="prices">
        <div class="row">
          <div class="column-title first-column">
          </div>
          <div class="column-title">
            General
          </div>
          <div class="column-title">
            VIP
          </div>
        </div>
        <div class="row">
          <div class="row-title first-column">
            <div>
              Venta general
            </div>
            <div>
              (6 de junio)
            </div>
          </div>
          <div>
            <app-price
              price=${`$ ${this.price.price + this.price.serviceCharge}`}
              bottom-info=${`$${this.price.price} + $${this.price.serviceCharge} service charge`}
            ></app-price>
          </div>
          <div>
            ${this.vip ?
              html`<app-price
                price=${`$ ${this.price.vipPrice}`}
                bottom-info=${`Los VIP no tienen service charge`}
              ></app-price>`
              :
              ''
            }
          </div>
        </div>
        <div class="row">
          <div class="row-title first-column">
            <div>
              En dólares
            </div>
            <div>
              (dólar 6 de junio $485)
            </div>
          </div>
          <div>
            <app-price
              price=${`us$ ${this.price.usd}`}
            ></app-price>
          </div>
          <div>
            ${this.vip ?
              html`<app-price
                price=${`us$ ${this.price.vipUsd}`}
              ></app-price>`
              :
              html`<div class="no-vip">Este sector no tiene VIP</div>`
            }
          </div>
        </div>
        ${this.usdToday > 0 ?
          html`
            <div class="row">
              <div class="row-title">
                <div>
                  Precio de reventa recomendado
                </div>
                <div>
                  (dólar hoy $${this.usdToday})
                </div>
              </div>
              <div class="colored">
                <app-price
                  price=${`$ ${+(this.usdToday * this.price.usd).toFixed(2)}`}
                ></app-price>
              </div>
              <div class="colored">
                ${this.vip ?
                  html`<app-price
                    price=${`$ ${+(this.usdToday * this.price.vipUsd).toFixed(2)}`}
                  ></app-price>`
                  :
                  ''
                }
              </div>
            </div>
            <div class="final">
              Los precios recomendados están calculados en base al valor del dólar de hoy ${this.getToday()}.
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
    </div>
    `;
  }
}
