import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { VIPPackagesRanges, stadiumRanges, stadiumSectors } from '../../data';
import '../app-price';
import { styleMap } from 'lit/directives/style-map.js';
import '../app-group-prices';
import {
  SALE_DAY_1,
  SALE_DAY_2,
  SALE_DAY_3,
  USD_VALUE_1,
  USD_VALUE_2,
  USD_VALUE_3
} from '../../data';

@customElement('app-prices')
export class AppPrices extends LitElement {
  static styles = css`
    h3 {
      margin: 0;
      font-size: 1rem;
      width: 100%;
      text-align: center;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
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
    .group-prices-container {
      width: 100%;
    }
    .final {
      font-size: 0.75rem;
      font-style: italic;
      margin-top: 1rem;
    }
  `;

  @property()
  priceid = '';

  @property({type: Number})
  usdToday = 0;

  @state()
  private vip = '';

  @state()
  private peso = [{
    price: 0,
    serviceCharge: 0,
    vip: 0,
  }];

  @state()
  private usd = [{
    price: 0,
    vip: 0,
  }];

  @state()
  private recommended = [
    {
      price: 0,
      vip: 0,
    }
  ];

  @state()
  private color = '';

  private getToday() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('es-AR', { month: 'long' });
    return `${day} de ${month}`;
  }

  private getTime() {
    const date = new Date();
    return date.toISOString().slice(11, 16);
  }

  private getPrice(id: string) {
    const sector = stadiumSectors[id];
    const priceRange = sector?.['price-range'] || '';
    this.vip = sector?.['VIP-package'] || '';

    const price = stadiumRanges[priceRange]?.price || 0;
    this.color = stadiumRanges[priceRange]?.color || '';
    const serviceCharge = stadiumRanges[priceRange]?.['service-charge'] || 0;
    const vipPrice = VIPPackagesRanges[this.vip]?.price || 0;

    const serviceChargeValues = [
      price * serviceCharge,
      price * serviceCharge,
      price * serviceCharge,
    ];

    const priceValues = [
      price + serviceChargeValues[0],
      price + serviceChargeValues[1],
      price + serviceChargeValues[2],
    ];

    const usdValues = [
      {
        price: priceValues[0] / USD_VALUE_1,
        vip: vipPrice / USD_VALUE_1,
      },
      {
        price: priceValues[1] / USD_VALUE_2,
        vip: vipPrice / USD_VALUE_2,
      },
      {
        price: priceValues[2] / USD_VALUE_3,
        vip: vipPrice / USD_VALUE_3,
      },
    ];

    this.peso = [
      {
        price,
        serviceCharge: serviceChargeValues[0],
        vip: vipPrice,
      },
      {
        price,
        serviceCharge: serviceChargeValues[1],
        vip: 0,
      },
      {
        price,
        serviceCharge: serviceChargeValues[2],
        vip: 0,
      },
    ];
    
    this.usd = [
      {
        price: Math.round(priceValues[0] / USD_VALUE_1),
        vip: Math.round(vipPrice / USD_VALUE_1),
      },
      {
        price: Math.round(priceValues[1] / USD_VALUE_2),
        vip: Math.round(vipPrice / USD_VALUE_2),
      },
      {
        price: Math.round(priceValues[2] / USD_VALUE_3),
        vip: Math.round(vipPrice / USD_VALUE_3),
      },
    ];

    this.recommended = [
      {
        price: Math.round(usdValues[0].price * this.usdToday),
        vip: Math.round(usdValues[0].vip * this.usdToday),
      },
      {
        price: Math.round(usdValues[1].price * this.usdToday),
        vip: Math.round(usdValues[1].vip * this.usdToday),
      },
      {
        price: Math.round(usdValues[2].price * this.usdToday),
        vip: Math.round(usdValues[2].vip * this.usdToday),
      },
    ];
  }

  protected performUpdate(): void | Promise<unknown> {
    this.getPrice(this.priceid);
    return super.performUpdate();
  }

  render() {
    if(!this.peso[0].price) return html``;
    return html`
      <div class="container">
        <h3>
          <span class="square" style=${styleMap({'background-color': this.color})}>
          </span>
          <span class="text">
            ${this.priceid ? stadiumSectors[this.priceid].name : ''}
          </span>
        </h3>
        <div class="group-prices-container">
          <app-group-prices
            .date=${{sale: SALE_DAY_1, today: this.getToday()}}
            .usdValue=${{sale: USD_VALUE_1, today: this.usdToday}}
            .peso=${this.peso[0]}
            .usd=${this.usd[0]}
            .recommended=${this.recommended[0]}
            .vipPackage=${this.vip}
          ></app-group-prices>
        </div>
        <div class="group-prices-container">
          <app-group-prices
            .date=${{sale: SALE_DAY_2, today: this.getToday()}}
            .usdValue=${{sale: USD_VALUE_2, today: this.usdToday}}
            .peso=${this.peso[1]}
            .usd=${this.usd[1]}
            .recommended=${this.recommended[1]}
            .vipPackage=${this.vip}
          ></app-group-prices>
        </div>
        <div class="group-prices-container">
          <app-group-prices
            .date=${{sale: SALE_DAY_3, today: this.getToday()}}
            .usdValue=${{sale: USD_VALUE_3, today: this.usdToday}}
            .peso=${this.peso[2]}
            .usd=${this.usd[2]}
            .recommended=${this.recommended[2]}
            .vipPackage=${this.vip}
          ></app-group-prices>
        </div>
        <div class="final">
          Los precios de reventa recomendados están calculados en base al valor del dólar de ahora, ${this.getToday()} a las ${this.getTime()}.
        </div>
      </div>
    `;
  }
}
